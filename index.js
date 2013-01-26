(function (root) {
    'use strict';
    var dummy = { dummy: 'dummy' },
        out = root.document.getElementById('out'),
        qout = root.document.getElementById('qout');


    function print(element, message) {
        element.innerHTML += message + '\n';
    }

    function p(message) { print(out, message); }

    function qp(message) { print(qout, message); }

    function testRejected(reason, test) {
        var vow1 = VOW.make();
        test(vow1.promise);
        root.setTimeout(function () { vow1['break'](reason); }, 2000);
    }

    testRejected(dummy, function (promise1) {
        function onPromise1Rejected(reason) {
            p('promise1 rejected with reason: ' + JSON.stringify(reason));
            return reason;
        }
        function onPromise2Fulfilled(value) {
            p('promise2 fulfilled with value: ' + JSON.stringify(value));
            return value;
        }
        function onPromise2Rejected(reason) {
            p('promise2 rejected with reason: ' + JSON.stringify(reason));
            return reason;
        }
        var promise2 = promise1.when(null, onPromise1Rejected);
        promise2.when(onPromise2Fulfilled, onPromise2Rejected);
    });


    function qtestRejected(reason, test) {
        var vow1 = Q.defer();
        test(vow1.promise);
        root.setTimeout(function () { vow1.reject(reason); }, 3000);
    }

    qtestRejected(dummy, function (promise1) {
        function onPromise1Rejected(reason) {
            qp('promise1 rejected with reason: ' + JSON.stringify(reason));
            return reason;
        }
        function onPromise2Fulfilled(value) {
            qp('promise2 fulfilled with value: ' + JSON.stringify(value));
            return value;
        }
        function onPromise2Rejected(reason) {
            qp('promise2 rejected with reason: ' + JSON.stringify(reason));
            return reason;
        }
        var promise2 = promise1.then(null, onPromise1Rejected);
        promise2.then(onPromise2Fulfilled, onPromise2Rejected);
    });

}(this));
