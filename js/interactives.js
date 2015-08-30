var $ = jQuery.noConflict();


$(document).ready(function(){
                

                //THIS SETS UP THE 1-2-3 PANELS
                
                if ($('#graphic').find('#panel_graphic').length > 0){
                            $('#graphic').find('#panel_graphic').cycle({ 
                                fx:     'fade', 
                                speed:  250, 
                                timeout:0, 
                                nowrap: true,
                                next:   '#next_panel', 
                                pager:  '#panel_tabs'
                            });
                            $('#next_panel').click(function() {
                                var num_panels = $(this).parent().siblings('#panel_tabs').find('a').length,
                                    curr_idx = $(this).parent().siblings('#panel_tabs').find('.activeSlide').index();
                                    
                                if (num_panels-1 == curr_idx) {
                                    if ($(this).hasClass('last')) {
                                        $(this).parent().siblings('#panel_tabs').find('a').first().click();
                                        $(this).removeClass('last').html('Next&nbsp;&raquo;');
                                    } else {
                                        $(this).addClass('last').html('Start over');
                                    }
                                } else {
                                    $(this).removeClass('last').html('Next&nbsp;&raquo;');
                                }
                            });
                            
                            $('#panel_tabs').children('a').click(function() {
                                if ($(this).index() == $(this).parent().children('a').length-1) {
                                    $('#next_panel').addClass('last').html('Start over');
                                } else {
                                    $('#next_panel').removeClass('last').html('Next&nbsp;&raquo;');
                                }
                            });
                        }
                        
                //THIS SETS UP THE MAPS

                $('.graphic').tooltip({
                                items: ".dot",
                                track: true});
                


//THIS IS THE BOTTOM BRACKET.
});

