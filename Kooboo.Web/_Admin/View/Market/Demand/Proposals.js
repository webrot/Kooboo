$(function() {

    var viewModel = function() {
        var self = this;

        this.curType = ko.observable();
        this.curType.subscribe(function(type) {
            if (type) {
                self.getListByType(type);
            }
        })
        this.proposalTypes = ko.observableArray();

        this.getListByType = function(type) {
            Kooboo.Demand.getMyProposalList({
                type: type
            }).then(function(res) {
                if (res.success) {
                    self.handleRecords(res.model);
                }
            })
        }

        this.changeTab = function(m, e) {
            self.curType(m.value);
        }

        this.onUpdateProposal = function(m, e) {
            Kooboo.Demand.getProposal({
                proposalId: m.id()
            }).then(function(res) {
                if (res.success) {
                    self.showingProposal(res.model);
                    self.showProposalModal(true);
                }
            })
        }
        this.showingProposal = ko.observable();
        this.showProposalModal = ko.observable(false);
        this.proposalViewingMode = ko.observable('edit');
        this.currency = ko.observable();

        this.onDeleteProposal = function(m, e) {
            if (confirm(Kooboo.text.confirm.recallProposal)) {
                Kooboo.Demand.deleteProposal({
                    proposalId: m.id()
                }).then(function(res) {
                    if (res.success) {
                        self.getListByType(self.curType());
                    }
                })
            }
        }

        this.pager = ko.observable();
        this.records = ko.observableArray();

        this.getProposalTypes = function(cb) {
            Kooboo.Demand.getProposalTypes().then(function(res) {
                if (res.success) {
                    self.proposalTypes(Kooboo.objToArr(res.model, 'value', 'displayName'));
                    cb && cb();
                }
            })
        }

        this.getProposalTypes(function() {
            self.curType(self.proposalTypes()[0].value);
        });

        this.handleRecords = function(data) {
            self.pager(data);
            self.records(data.list.map(function(item) {
                return new Record(item);
            }));
        }

        Kooboo.EventBus.subscribe("kb/pager/change", function(page) {
            Kooboo.Demand.getMyProposalList({
                type: self.curType(),
                pageNr: page
            }).then(function(res) {
                if (res.success) {
                    self.handleRecords(res.model);
                }
            })
        })

        Kooboo.EventBus.subscribe('kb/demand/proposal/update', function() {
            self.getListByType(self.curType());
        })
    }

    var vm = new viewModel();
    ko.applyBindings(vm, document.getElementById('main'));

    function Record(data) {
        var date = new Date(data.createTime);

        this.id = ko.observable(data.id);
        this.title = ko.observable(data.demandTitle || '-');
        this.budget = ko.observable(data.symbol + data.budget);
        this.duration = ko.observable(data.duration + ' Day(s)')
        this.createTime = ko.observable(date.toDefaultLangString());
        this.currency = ko.observable(data.currency);

        this.previewUrl = function() {
            return '/_Admin/Witkey/Demand/Detail?id=' + data.demandId
        }
    }
})