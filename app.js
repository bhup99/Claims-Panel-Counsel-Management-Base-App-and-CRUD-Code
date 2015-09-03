var app = angular.module('app', []);

app.controller('MainCtrl', MainCtrl);

function MainCtrl($scope, $http, $window, $filter) {

	$scope.currentRow = {};
	$scope.list = {};
	$scope.currentRow.id=-1;
	$scope.doShowList = false;
	$scope.departments = ["P&C", "PL", "F&S"] ;
	$scope.status = ["Active", "Inactive", "Probationary"];
	$scope.defenceType = ["Administrative_Defence", "Coverage", "Construction_Defect", "Cyber", "Property", "Casualty",
					"Surety", "Fidelty", "Subrogation", "Sex_Abuse", "Strategic"] ;
	$scope.vendorType = ["Attorney", "Adjuster", "Expert"] ;

	$scope.toggle = (function() {
		$scope.doShowList = !$scope.doShowList;
	});

	$scope.setRateChanger = (function() {
		if(typeof $scope.userEnrolledId === 'undefined')	return ;
		$scope.currentRow.Rate_Changed_By = $scope.userEnrolledId ;
		$scope.currentRow.Rate_Approval_Date = $filter('date')(new Date(), 'dd/MM/yyyy');
	})

	$scope.getCurrentRow = (function(id) {
		$scope.doShowList = !$scope.doShowList ;
		$http.get('/api/list/'+id)
			.success(function(data) {
				$scope.currentRow = data[0];
				console.log("Successfully received row: " + JSON.stringify(data));
			})
			.error(function(data) {
				console.log("Could not fetch row with id: " + id);
			});
	});

	$http.get('/api/list')
		.success(function(data) {
			$scope.list = data;
			console.log("Not so much required " + JSON.stringify($scope.currentRow));
		})
		.error(function(data) {
			console.log("Error:" + data) ;
		});

	$scope.removeRow = (function(id) {
		$http.delete('/api/list/'+id)
			.success(function(data) {
				$scope.list = data;
				console.log("Data after deleting is " + data.length);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	});

	$scope.create = (function() {
		/*if($scope.currentRow==null || $scope.currentRow.id==-1)	{
			$scope.currentRow.id = $scope.list.length+1 ;
		}*/
		console.log($scope.currentRow);
		if($scope.currentRow.id == -1) 
			$scope.currentRow.id = $scope.list.length + 1 ;
		$http.post('/api/list', $scope.currentRow)
			.success(function(data) {
				//$window.location.href = "index.html";
			})
			.error(function(data) {
				console.log("Error while creating or editing (whatever) the form ") ;
			});
	});
}