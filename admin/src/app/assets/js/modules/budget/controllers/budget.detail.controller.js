import angular from "angular";

export default function BudgetDetailController($rootScope, $translate, $state, $stateParams, Budget, Chapter, Batch) {
  const vm = this;

  // Initialize properties
  vm.budget = {};
  vm.chapters = [];
  vm.batches = [];
  vm.displayItems = [];
  vm.imageLoaded = false;
  vm.imageError = false;
  vm.isCreating = $state.current.name === 'budget-create';

  // Methods
  vm.loadBudget = loadBudget;
  vm.saveBudget = saveBudget;
  vm.addChapter = addChapter;
  vm.addBatch = addBatch;
  vm.deleteItem = deleteItem;
  vm.updateCalculations = updateCalculations;
  vm.buildDisplayItems = buildDisplayItems;
  vm.removeThumbnail = removeThumbnail;

  activate();

  // Initialize controller
  function activate() {
    if (vm.isCreating) {
      initializeNewBudget();
    } else {
      loadBudget();
    }
  }

  // Initialize an empty budget
  function initializeNewBudget() {
    vm.budget = {
      name: '',
      thumbnail: '',
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      totalCost: 0,
      totalSale: 0
    };
    vm.chapters = [];
    vm.batches = [];
    buildDisplayItems();
  }

  // Load existing budget
  function loadBudget() {
    const budgetId = $stateParams.id;
    
    Budget.findById({ 
      id: budgetId, 
      filter: { include: [{ chapters: 'batches' }] }
    }).$promise
      .then(function(budget) {
        vm.budget = budget;
        vm.chapters = budget.chapters || [];
        
        // Flatten batches from chapters
        vm.batches = [];
        vm.chapters.forEach(function(chapter) {
          if (chapter.batches) {
            vm.batches = vm.batches.concat(chapter.batches);
          }
        });
        
        buildDisplayItems();
        updateCalculations();
      })
      .catch(function(error) {
        alert('Error loading budget' + (error.data?.error?.message ? ': ' + error.data.error.message : ''));
      });
  }

  // Save budget and its chapters/batches
  function saveBudget() {
    // Validate required fields
    if (!vm.budget.name || !vm.budget.clientName || !vm.budget.date) {
      alert('Please fill in all required fields: Name, Client Name, and Date');
      return;
    }

    updateCalculations();

    let savePromise;
    
    // Creating a new budget or update existing one
    if (vm.isCreating) {
      savePromise = Budget.create(vm.budget).$promise;
    } else {
      savePromise = Budget.prototype$patchAttributes({ id: vm.budget.id }, vm.budget).$promise;
    }

    savePromise
      .then(function(savedBudget) {
        vm.budget = savedBudget;
        vm.isCreating = false;
        
        return saveChaptersAndBatches();
      })
      .then(function() {
        $state.go('budget');
      })
      .catch(function(error) {
        // Enhanced error handling
        let errorMessage = 'Error saving budget. ';
        if (error.data?.error?.message) {
          errorMessage += 'Details: ' + error.data.error.message;
        } else if (error.data?.error) {
          errorMessage += 'Details: ' + JSON.stringify(error.data.error);
        } else if (error.message) {
          errorMessage += 'Details: ' + error.message;
        } else {
          errorMessage += 'Please check the console for details.';
        }
        
        alert(errorMessage);
      });
  }

  // Save chapters and batches
  function saveChaptersAndBatches() {
    // Save chapters first
    const chapterPromises = vm.chapters.map(function(chapter) {
      chapter.budgetId = vm.budget.id;
      
      // update existing chapters or create new ones
      if (chapter.id && !chapter.isTemp) {
        const updateData = angular.copy(chapter);
        delete updateData.type;
        return Chapter.prototype$patchAttributes({ id: chapter.id }, updateData).$promise;
      } else {
        const chapterData = angular.copy(chapter);
        delete chapterData.id;
        delete chapterData.isTemp;
        delete chapterData.type;
        delete chapterData.tempId;
        
        return Chapter.create(chapterData).$promise
          .then(function(savedChapter) {
            // Update temporary ID references in batches
            const oldId = chapter.id;
            chapter.id = savedChapter.id;
            chapter.isTemp = false;
            
            vm.batches.forEach(function(batch) {
              if (batch.chapterId === oldId) {
                batch.chapterId = savedChapter.id;
              }
            });
            
            return savedChapter;
          });
      }
    });

    // Save batches after chapters
    return Promise.all(chapterPromises).then(function() {
      const batchPromises = vm.batches.map(function(batch) {
        // Save existing batches or create new ones
        if (batch.id && !batch.isTemp) {
          const updateData = angular.copy(batch);
          delete updateData.type;
          return Batch.prototype$patchAttributes({ id: batch.id }, updateData).$promise;
        } else {
          const batchData = angular.copy(batch);
          delete batchData.id;
          delete batchData.isTemp;
          delete batchData.type;
          
          return Batch.create(batchData).$promise
            .then(function(savedBatch) {
              batch.id = savedBatch.id;
              batch.isTemp = false;
              return savedBatch;
            });
        }
      });
      
      return Promise.all(batchPromises);
    });
  }

  // Add new chapter to budget
  function addChapter() {
    const tempId = generateTemporaryIds('chapter');
    
    const newChapter = {
      id: tempId,
      tempId: tempId,
      rank: vm.chapters.length + 1,
      description: 'New Chapter ' + (vm.chapters.length + 1),
      materialSaleCoefficient: 1.0,
      labourSaleCoefficient: 1.0,
      totalCost: 0,
      totalSale: 0,
      budgetId: vm.budget.id,
      type: 'chapter',
      isTemp: true
    };
    
    vm.chapters.push(newChapter);
    buildDisplayItems();
  }

  // Add new batch to a chapter
  function addBatch(chapter) {
    const tempId = generateTemporaryIds('batch');
    
    const newBatch = {
      id: tempId,
      rank: getBatchesForChapter(chapter).length + 1,
      description: 'New Batch ' + (getBatchesForChapter(chapter).length + 1),
      amount: 1,
      materialCost: 0,
      labourCost: 0,
      unitaryCost: 0,
      totalCost: 0,
      unitarySale: 0,
      totalSale: 0,
      chapterId: chapter.id,
      type: 'batch',
      isTemp: true
    };
    
    vm.batches.push(newBatch);
    buildDisplayItems();
    updateCalculations();
  }

  // Delete a chapter or batch
  function deleteItem(item) {
    const itemType = item.type === 'chapter' ? 'chapter' : 'batch';
    let message = 'Are you sure you want to delete this ' + itemType + '?';
    
    // Warn about associated items
    if (item.type === 'chapter') {
      const batchCount = getBatchesForChapter(item).length;
      if (batchCount > 0) {
        message += '\nThis will also delete ' + batchCount + ' associated batch(es).';
      }
    }
    
    if (!confirm(message)) return;

    if (item.type === 'chapter') {
      // Remove associated batches first
      vm.chapters = vm.chapters.filter(function(chapter) {
        return chapter !== item;
      });
      
      vm.batches = vm.batches.filter(function(batch) {
        return batch.chapterId !== item.id;
      });
      
      // Delete chapter from server
      if (item.id && !item.isTemp) {
        Chapter.deleteById({ id: item.id });
      }
    } else {
      // Remove single batch
      vm.batches = vm.batches.filter(function(batch) {
        return batch !== item;
      });
      
      // Delete batch from server
      if (item.id && !item.isTemp) {
        Batch.deleteById({ id: item.id });
      }
    }
    
    buildDisplayItems();
    updateCalculations();
  }

  // Generate unique temporary IDs for new items
  function generateTemporaryIds(prefix = 'temp') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  // Calculate all costs and sales based on business rules
  function updateCalculations() {
    // Calculate batch-level values
    vm.batches.forEach(function(batch) {
      // Unitary cost = material cost + labour cost
      batch.unitaryCost = (parseFloat(batch.materialCost) || 0) + (parseFloat(batch.labourCost) || 0);
      // Total cost = unitary cost * amount
      batch.totalCost = batch.unitaryCost * (parseFloat(batch.amount) || 0);
      
      // Apply chapter coefficients to calculate sale prices
      const chapter = findChapterForBatch(batch);
      if (chapter) {
        const materialSale = (parseFloat(batch.materialCost) || 0) * (parseFloat(chapter.materialSaleCoefficient) || 1);
        const labourSale = (parseFloat(batch.labourCost) || 0) * (parseFloat(chapter.labourSaleCoefficient) || 1);
        batch.unitarySale = materialSale + labourSale;
        batch.totalSale = batch.unitarySale * (parseFloat(batch.amount) || 0);
      }
    });

    // Calculate chapter-level totals (sum of batches)
    vm.chapters.forEach(function(chapter) {
      const chapterBatches = getBatchesForChapter(chapter);
      chapter.totalCost = chapterBatches.reduce(function(sum, batch) {
        return sum + (parseFloat(batch.totalCost) || 0);
      }, 0);
      chapter.totalSale = chapterBatches.reduce(function(sum, batch) {
        return sum + (parseFloat(batch.totalSale) || 0);
      }, 0);
    });

    vm.budget.totalCost = vm.chapters.reduce(function(sum, chapter) {
      return sum + (parseFloat(chapter.totalCost) || 0);
    }, 0);
    vm.budget.totalSale = vm.chapters.reduce(function(sum, chapter) {
      return sum + (parseFloat(chapter.totalSale) || 0);
    }, 0);
  }

  // Build flattened array for table display (chapters followed by their batches)
  function buildDisplayItems() {
    vm.displayItems = [];
    
    // Sort chapters by rank
    const sortedChapters = vm.chapters.slice().sort(function(a, b) {
      return (a.rank || 0) - (b.rank || 0);
    });
    
    // Add each chapter followed by its sorted batches
    sortedChapters.forEach(function(chapter) {
      chapter.type = 'chapter';
      vm.displayItems.push(chapter);
      
      const chapterBatches = getBatchesForChapter(chapter).sort(function(a, b) {
        return (a.rank || 0) - (b.rank || 0);
      });
      
      chapterBatches.forEach(function(batch) {
        batch.type = 'batch';
        vm.displayItems.push(batch);
      });
    });
  }

  // Get all batches belonging to a specific chapter
  function getBatchesForChapter(chapter) {
    return vm.batches.filter(function(batch) {
      return batch.chapterId === chapter.id;
    });
  }

  // Find the chapter that owns a specific batch
  function findChapterForBatch(batch) {
    return vm.chapters.find(function(chapter) {
      return chapter.id === batch.chapterId;
    });
  }

  // Remove thumbnail from budget
  function removeThumbnail() {
    vm.budget.thumbnail = '';
  }
}

BudgetDetailController.$inject = ['$rootScope', '$translate', '$state', '$stateParams', 'Budget', 'Chapter', 'Batch'];