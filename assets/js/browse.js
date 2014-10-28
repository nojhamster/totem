//document.location.href = '/browse.html';

$(document).ready(function() {

    var oTable = $('#browseTable').dataTable({
            "search" : {
                "regex" : true
            },
            ordering: true,
            dom : "ilfrtp",
            info : true,
            ajax: "/browse.json",
            serverSide: true,
            lengthMenu : [15,1,3,5,10,25,50,100,200,500],
            "language": {
                "emptyTable":     "Aucun document présent",
                "lengthMenu": " _MENU_ Document(s) / page",
                "search": "Rechercher:",
                "zeroRecords": "Aucun résultat ...",
                "info": "Il y a _TOTAL_ résultat(s)",
                "infoFiltered": "( filtrés sur _MAX_ )",
                "paginate": {
                    "previous": "Précédent",
                    "next" : "Suivant",
                }
            },
            columns: [
                { data: 'wid' , visible : false , searchable: false},
                { data: 'fields.validate', visible : false , searchable: false},
                { data: 'object' , className: "browseYear browseTd", searchable: true},
                { data: 'fields.title' , className: "browseTitle browseTd", searchable: true}
            ],

            "fnCreatedRow": function( row, td, index ) {

                var rowValue = oTable.fnGetData( index );

                if(rowValue['validate'] == "yes"){

                    $(row).attr('class', 'trValidate');
                }

            },

            fnDrawCallback: function(){

                $('tbody tr').on('click',function() {
                    var position =  oTable.fnGetPosition(this);
                    var docID = oTable.fnGetData( position );
                    document.location.href = "/display/" + docID.wid + '.html';
                }).addClass('trBody');
            }
        }),
        thead = $('#menuThead');

    $('#browseChangeList').on('change', function() {
        if( $(this).val() == 'traites'){
            oTable.fnFilter( 'yes' , 1 );
        }
        else if( $(this).val() == 'nonTraites'){

            oTable.fnFilter( 'no' , 1 );
        }
        else if( $(this).val() == 'tous'){
            oTable.fnFilter('',1);
        }
    } );

    $(window).scroll(function () {
        if ($(this).scrollTop() > 541) {
            thead.addClass("fixedThead");
        } else {
            thead.removeClass("fixedThead");
        }
    });



    // Get data-href of csv score & redirect to it

    var goToLocation  = function(element){
        window.location = element.currentTarget.getAttribute('data-href');
    };


    $('#exportResults').on('click' , goToLocation);

});