(function () {
  angular.module('NALP')
    .controller('planCtrl', planCtrl)

  planCtrl.$inject = ['selectedPlans_fac', '$state', 'plan_fac', "$stateParams", 'store'];

  function planCtrl(selectedPlans_fac, $state, plan_fac, $stateParams, store) {
    var vm = this;
    vm.title = 'plan view title'
    vm.some_user_id = store.get('current_user_id');
    vm.addedEvents = [];
    vm.totalCost = 0;
    vm.isNotComplete;
    vm.isBookmarked;


    var err_callback = function (err) {
      console.log('err >>', err);
    }

    plan_fac
      .show($stateParams.plan_id)
      .then(success_call, err_callback)

    function success_call(res) {
      vm.totalCompleted = res.data.plan.ratings.length;
      vm.addedEvents = res.data.plan.events;
      vm.currentPlanId = res.data.plan._id;
      vm.currentPlanUserId = res.data.plan.created_by_id;
      vm.ratings = res.data.plan.ratings.length;
      vm.bookmarks = res.data.plan.bookmarks.length;
      console.log('res.data.plan.events = ', res.data.plan.events)
      if (!res.data.plan.ratings.includes(vm.currentPlanUserId)) {
        vm.isNotComplete = true;
      }
      for (let i = 0; i < vm.addedEvents.length; i++) {
        vm.totalCost += parseFloat(vm.addedEvents[i].cost);
      }
    }

    vm.userDidClickMarkAsComplete = function () {
      console.log('button clicked!');
      vm.option = 'completed';
      plan_fac
        .mark_plan_complete(vm.currentPlanId, {
          user_id: vm.some_user_id,
          completed: true
        })
        .then(mark_com_res, err_callback)
    }

    function mark_com_res(res) {
      console.log(res, '< success')
      vm.isNotComplete = false;
      vm.ratings = res.data.plan.ratings.length;
    }

    vm.userDidClickMarkAsIncomplete = function () {
      console.log('clicked incomplete')
      plan_fac
        .mark_plan_incomplete(vm.currentPlanId, {
          user_id: vm.some_user_id,
          completed: false
        })
        .then(mark_incomplete_res, err_callback)
    }

    function mark_incomplete_res(res) {
      console.log(res, '<< successfully marked incomplete');
      vm.isNotComplete = true;
      vm.ratings = res.data.plan.ratings.length;
    }

    vm.userDidClickBookmark = function () {
      console.log('clicked bookmark')
      plan_fac
        .bookmark(vm.currentPlanId, {
          user_id: vm.some_user_id,
          bookmark: true
        })
        .then(bookmark_res, err_callback)
    }

    function bookmark_res(res) {
      console.log(res, 'success bookmark res')
      vm.isBookmarked = true;
      vm.bookmarks = res.data.plan.bookmarks.length;
    }

    vm.userDidClickRemoveBookmark = function () {
      console.log('clicked remove bookmark');
      plan_fac
        .bookmark(vm.currentPlanId, {
          user_id: vm.some_user_id,
          bookmark: false
        })
        .then(remove_bookmark_res, err_callback)
    }

    function remove_bookmark_res(res) {
      console.log(res, 'success, bookmark removed')
      vm.isBookmarked = false;
      vm.bookmarks = res.data.plan.bookmarks.length;
    }

  }
})()