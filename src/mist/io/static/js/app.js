location.hash = '#splash';

// Define libraries
require.config({
    baseUrl: 'static/js/',
    paths: {
        mocha: 'lib/mocha-1.4.2',
        chai: 'lib/chai-1.2.0',
        jquery: 'lib/jquery-1.8.1',
        jqueryUi: 'lib/jquery-ui-1.8.23.custom',
        text: 'lib/require/text',
        ember: 'lib/ember-0.9.8.1',
        mobile: 'lib/jquery.mobile-1.2.0',
        d3: 'lib/d3-2.10.1',
        cubism: 'lib/cubism-1.2.2'
    },
    shim: {
        'ember': {
            deps: ['jquery']
        },
        'jqueryUi': {
            deps: ['jquery']
        },
        'mobile': {
           deps: ['ember']
        },
        'd3': {
            deps: ['jquery']
        },
        'cubism':{
            deps: ['d3']
        }
    }
});

// Load our app
define( 'app', [
    'jquery',
    'jqueryUi',
    'd3',
    'app/controllers/backends',
    'app/controllers/confirmation',
    'app/controllers/notification',
    'app/controllers/machine_add',
    'app/controllers/select_machines',
    'app/controllers/select_images',
    'app/views/count',
    'app/views/backend_button',
    'app/views/backend_add',
    'app/views/backend_edit',
    'app/views/machine_list_item',
    'app/views/image_list_item',
    'app/views/enable_backend_button',
    'app/views/machine_add_dialog',
    'app/views/machine',
    'app/views/machine_list',
    'app/views/confirmation_dialog',
    'app/views/machine_actions_dialog',
    'app/views/single_machine_actions_dialog',
    'app/views/shell',
    'app/views/image_list',
    'app/views/delete_tag',
    'app/views/machine_tags_dialog',
    'app/views/machine_monitoring_dialog',
    'mobile',
    'cubism',
    'ember'
    ], function($,
                jQueryUI,
                d3,
                BackendsController,
                ConfirmationController,
                NotificationController,
                MachineAddController,
                SelectMachinesController,
                SelectImagesController,
                Count,
                BackendButton,
                AddBackend,
                EditBackend,
                MachineList,
                ImageList,
                EnableBackendButton,
                MachineAddDialog,
                MachineView,
                MachineListView,
                ConfirmationDialog,
                MachineActionsDialog,
                SingleMachineActionsDialog,
                Shell,
                ImageListView,
                DeleteTagView,
                MachineTagsDialog,
                MachineMonitoringDialog,
                Mobile,
                cubism
                ) {

        var mobileinit = false;
        $(document).bind('pageinit', function() {
            if (mobileinit){
                return
            }

            mobileinit = true;

            var App = Ember.Application.create({

                VERSION: '0.3-ember',

                // Sets up mocha to run some integration tests
                specsRunner: function( chai ) {
                    // Create placeholder for mocha output
                    $( document.body ).before( '<div id="mocha"></div>' );

                    // Setup mocha and expose chai matchers
                    window.expect = chai.expect;
                    mocha.setup('bdd');

                    // Load testsuite
                    require([
                        'app/specs/templates/basic_acceptance'
                    ], function() {
                            mocha.run().globals( [ '$', 'Ember', 'Mist' ] );
                        }
                    );
                },

                // Constructor
                init: function() {
                    this._super();

                    this.set(
                        'backendsController',
                        BackendsController.create()
                    );

                    this.set(
                        'confirmationController',
                        ConfirmationController.create()
                    );

                    this.set(
                        'notificationController',
                           NotificationController.create()
                    );

                    this.set(
                        'machineAddController',
                        MachineAddController.create()
                    );

                    this.set(
                        'selectMachinesController',
                        SelectMachinesController.create()
                    );

                    this.set(
                        'selectImagesController',
                        SelectImagesController.create()
                    );

                    // Run specs if asked
                    if ( location.hash.match( /specs/ ) ) {
                        require( [ 'chai', 'mocha' ], this.specsRunner );
                    }

                    setTimeout(function(){
                        $.mobile.changePage('#home', { transition: 'fade' });
                    }, 2000);


                }
            });

            $(document).on( 'pagebeforeshow', '#machines', function() {
                $('#machines-list').listview('refresh');
            });

            $(document).on( 'popupbeforeposition', '#dialog-power', function() {
                $("#dialog-power a").button();
            });

            $(document).on( 'popupbeforeposition', '#dialog-single-power', function() {
                $("#dialog-single-power a").button();
            });

            $(document).on( 'pagebeforeshow', '#images', function() {
                $("#images-list").listview('refresh');
            });

            $(document).on( 'pagebeforeshow', '#single-machine', function() {
                Mist.graphPolling = true;
            });

            $(document).on( 'pageshow', '#single-machine', function() {
                $(".monitoring-button").button();
            });

            $(document).on( 'pagebeforehide', '#single-machine', function() {
                Mist.graphPolling = false;
            });

            // Console toggle behavior
            $(document).ready(function() {
                $('#shell-return').on('click', '.command', function() {
                    var out = $(this).next('.output');
                    if (out.is(':visible')) {
                        out.slideUp(300);
                        $(this).parent().addClass('contracted').removeClass('expanded');
                    } else {
                        out.slideDown(200);
                        $(this).parent().removeClass('contracted').addClass('expanded');
                    }
                });
            });

            App.Select = Ember.Select.extend({
                attributeBindings: [
                    'name',
                    'data-theme',
                    'data-icon',
                    'data-native-menu',
                    'disabled'
                ],
            });

            App.TextField = Ember.TextField.extend({
                attributeBindings: [
                    'name',
                    'data-theme'
                ]
            });

            App.ShellTextField = Ember.TextField.extend({
                attributeBindings: [
                    'name',
                    'data-theme',
                    'autocapitalize'
                ],

                insertNewline: function() {
                    this.controller.submit();
                }
            });

            App.Checkbox = Ember.Checkbox.extend({
                attributeBindings: [
                    'name',
                    'id',
                    'data-inline'
                ],
            });

            App.CountView = Count;
            App.BackendButtonView = BackendButton;
            App.AddBackendView = AddBackend;
            App.EditBackendView = EditBackend;
            App.MachineListView = MachineList;
            App.ImageListView = ImageList;
            App.EnableBackendButtonView = EnableBackendButton;
            App.DeleteTagView = DeleteTagView;
            App.onOff = ['on', 'off'];

            var machineView = MachineView.create();
            machineView.append();

            var confirmationDialog = ConfirmationDialog.create();
            confirmationDialog.append();

            var dialog = SingleMachineActionsDialog.create();
            dialog.appendTo("#single-machine");
            var shellDialog = Shell.create();
            shellDialog.appendTo("#single-machine");
            var machineTagsDialog = MachineTagsDialog.create();
            machineTagsDialog.appendTo("#single-machine");
            
            var machineListView = MachineListView.create();
            machineListView.append();
            var addDialog = MachineAddDialog.create();
            addDialog.appendTo("#machines");
            shellDialog = Shell.create();
            shellDialog.appendTo("#machines");
            var machineActionsDialog = MachineActionsDialog.create();
            machineActionsDialog.appendTo("#machines");
            machineTagsDialog = MachineTagsDialog.create();
            machineTagsDialog.appendTo("#machines");
            
            var imageListView = ImageListView.create();
            imageListView.append();

            var machineMonitoringDialog = MachineMonitoringDialog.create();
            machineMonitoringDialog.append();

            $(document).on( 'pagebeforeshow', '#dialog-add', function(){
                $('#dialog-add').trigger('create');
            });

            // Expose the application globally
            return window.Mist = App;
        });
    }
);

//LOGLEVEL comes from home python view and home.pt
function log() {
    try {
        if (LOGLEVEL > 3) {
            return console.log.apply(this, arguments);
        }
    } catch(err) {}
}

function info() {
    try {
        if (LOGLEVEL > 2) {
            return console.info.apply(this, arguments);
        }
    } catch(err) {}
}

function warn() {
    try {
        if (LOGLEVEL > 1) {
            return console.warn.apply(this, arguments);
        }
    } catch(err) {}
}

function error() {
    try {
        if (LOGLEVEL > 0) {
            return console.error.apply(this, arguments);
        }
    } catch(err) {}
}
