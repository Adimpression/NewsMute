(function($){
    $.fn.DOPPanel = function(options){
        var Data = {},

        Container = this,
        MainColor = 'af3425',
        
        methods = {
                    init:function( ){// Init Plugin.
                        return this.each(function(){                            
                            if (options){
                                $.extend(Data, options);
                            }
                            
                            methods.initPanel();
                        });
                    },
                    
                    initPanel:function(){
                        var data = methods.getData();
                        
                        if (data != null){
                            websiteType = data['WebsiteType'];
                            contentPosition = data['ContentPosition'];
                            pattern = data['Pattern'];
                            backgroundImage = data['BackgroundImage'];
                            birdsFlyFrom = data['BirdsFlyFrom'];
                            noBirds = data['NoBirds'];
                            MainColor = data['MainColor'];
                        }

                        $('#panel_website_type option[value="'+websiteType+'"]').attr('selected', 'selected');
                        $('#panel_content_position option[value="'+contentPosition+'"]').attr('selected', 'selected');
                        $('#pattern-'+pattern).addClass('selected');
                        $('#panel_background_image option[value="'+backgroundImage+'"]').attr('selected', 'selected');
                        $('#panel_birds_fly_from option[value="'+birdsFlyFrom+'"]').attr('selected', 'selected');
                        $('#panel_no_birds option[value="'+noBirds+'"]').attr('selected', 'selected');
                        
                        if (MainColor == undefined){
                            MainColor = 'af3425';
                        }
                        $('#panel_main_color').val(MainColor);
                        $('#panel_main_color').css('background', '#'+MainColor);

                        $('#wrapper').removeClass('left').removeClass('right').addClass(contentPosition);
                        methods.panelChangePattern(pattern);
                        methods.panelUseColors()
                        methods.initActions();
                    },
                    
                    initActions:function(){
                        $('.toggle-button', Container).unbind('click');
                        $('.toggle-button', Container).bind('click', function(){
                            methods.panelToggle();
                        });
                        
                        $('.open', Container).unbind('click');
                        $('.open', Container).bind('click', function(){
                            var className = $(this).parent().attr('class');
                        
                            methods.optionsToggle($('.'+className+'-list', $(this).parent()), $('.options-toggle', $(this).parent()));
                        });
                        
                        /* General Settings */
                        $('.general-settings-toggle', Container).bind('click', function(){
                            methods.optionsToggle('.general-list', this);
                        });
                        
                        $('#panel_website_type').bind('change', function(){
                            websiteType = $(this).val(); 
                            methods.saveData();
                        });
                        
                        $('#panel_content_position', Container).bind('change', function(){
                            contentPosition = $(this).val();
                            $('#wrapper').removeClass('left').removeClass('right').addClass(contentPosition);
                            initBackground($('#panel_background_image').val());
                            $(Container).removeAttr('style');
                            
                            if ($('#wrapper').hasClass('left')){
                                $(Container).css('right', 0);
                            }
                            else{
                                $(Container).css('left', 0);
                            }
                            methods.saveData();
                        });
                        
                        $('#panel_main_color').ColorPicker({
                            onSubmit:function(hsb, hex, rgb, el){
                                $(el).val(hex);
                                $(el).ColorPickerHide();
                                $(el).removeAttr('style');
                                $(el).css({'background-color': '#'+hex,
                                           'color': prototypes.idealTextColor(hex) == 'white' ? '#ffffff':'#0000000'});
                                MainColor = hex;
                                methods.saveData();
                            },
                            onBeforeShow:function(){
                                $(this).ColorPickerSetColor(this.value);
                            },
                            onShow:function(colpkr){
                                $(colpkr).fadeIn(500);
                                return false;
                            },
                            onHide:function(colpkr){
                                $(colpkr).fadeOut(500);
                                return false;
                            }
                        })
                        .bind('keyup', function(){
                            $(this).ColorPickerSetColor(this.value);
                            $(this).removeAttr('style');

                            if (this.value.length != 6){
                                $(this).css({'background-color': '#ffffff',
                                             'color': '#0000000'});
                                MainColor = 'af3425';
                            }
                            else{
                                $(this).css({'background-color': '#'+this.value,
                                             'color': prototypes.idealTextColor(this.value) == 'white' ? '#ffffff':'#0000000'});
                                MainColor = this.value;
                            }
                        
                            methods.saveData();
                        });
                        
                        /* Patterns */
                        $('.patterns-toggle', Container).bind('click', function(){
                            methods.optionsToggle('.patterns-list', this);
                        });
                        
                        $('.patterns-list a', Container).bind('click', function(){
                            methods.panelChangePattern($(this).attr('id').split('pattern-')[1]);
                        });
                        
                        /* Background Settings */
                        $('.background-settings-toggle', Container).bind('click', function(){
                            methods.optionsToggle('.background-list', this);
                        });
                        
                        $('#panel_background_image', Container).bind('change', function(){
                            initBackground($(this).val());
                            methods.saveData();
                        });
                        
                        $('#panel_birds_fly_from', Container).bind('change', function(){
                            methods.panelChangeBirds();
                        });
                        
                        $('#panel_no_birds', Container).bind('change', function(){
                            methods.panelChangeBirds();
                        });
                    },
                    
                    panelToggle:function(){
                        if ($('#wrapper').hasClass('left')){
                            if (parseInt($(Container).css('right')) == -235){
                                $(Container).stop(true, true).animate({'right': 0}, 'fast');
                            }
                            else{
                                $(Container).stop(true, true).animate({'right': -235}, 'fast');
                            }
                        }
                        else{
                            if (parseInt($(Container).css('left')) == -235){
                                $(Container).stop(true, true).animate({'left': 0}, 'fast');
                            }
                            else{
                                $(Container).stop(true, true).animate({'left': -235}, 'fast');
                            }
                        }
                    },
                    
                    optionsToggle:function(item, button){
                        $(item, Container).slideToggle('fast')   
                       
                        if ($(button).hasClass('icon-67')){
                            $(button).removeClass('icon-67');
                            $(button).addClass('icon-69');
                        }
                        else{
                            $(button).removeClass('icon-69');
                            $(button).addClass('icon-67');
                        } 
                    },
               
                    panelChangePattern:function(no){
                        $('#background-wrapper .pattern').removeClass('pattern-1')
                                                         .removeClass('pattern-2')
                                                         .removeClass('pattern-3')
                                                         .removeClass('pattern-4')
                                                         .removeClass('pattern-5')
                                                         .removeClass('pattern-6')
                                                         .removeClass('pattern-7')
                                                         .removeClass('pattern-8')
                                                         .removeClass('pattern-9')
                                                         .removeClass('pattern-10')
                                                         .removeClass('pattern-11');
                        $('#background-wrapper .pattern').addClass('pattern-'+no);
                        $('.patterns ul li', Container).removeClass('selected');
                        $('.patterns ul li a#pattern-'+no, Container).parent().addClass('selected');
                        
                        pattern = no;
                        methods.saveData();
                    },
                    
                    panelUseColors:function(){
                        methods.staticUseColors();
/* Begin Navigation */     
                        // Menu    
                        $('#navigation-wrapper #menu > li').hover(function(){
                            $('> a', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('> a', this).css('background-color', '');
                        });
                        
                        $('#navigation-wrapper #menu > li > ul li').hover(function(){
                            $('> a', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('> a', this).css('background-color', '');
                        });
                        
                        // Mobile Menu
                        
                        $('#navigation-wrapper #mobile-menu > li > ul > li').hover(function(){
                            $('> a', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('> a', this).css('background-color', '');
                            
                        });
                        
                        $('#navigation-wrapper #mobile-menu > li > ul > li li > a').hover(function(){
                            $(this).css('color', '#'+MainColor);
                            $('.more .square1', this).css('background', '#'+MainColor);
                            $('.more .square2', this).css('background', '#'+MainColor);
                            $('.more .square3', this).css('background', '#'+MainColor);
                        },
                        function(){
                            $(this).css('color', '');
                            $('.more .square1', this).css('background', '');
                            $('.more .square2', this).css('background', '');
                            $('.more .square3', this).css('background', '');
                        });
                        
                        // Search  
                        $('#navigation-wrapper form#searchform').hover(function(){
                            $('input[type=submit]', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('input[type=submit]', this).css('background-color', '');
                        });
/* End Navigation */     

/* Begin Typhography */
                        $('#main .content a').hover(function(){
                            $(this).css('color', '#'+MainColor);
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('color', '');
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content input[type=text]').hover(function(){
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            if (!$(this).is(':focus')){
                                $(this).css('border-color', '');
                            }
                        });
                        
                        $('#main .content input[type=text]').focus(function(){
                            $(this).css('border-color', '#'+MainColor);
                        });
                        
                        $('#main .content input[type=text]').blur(function(){
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content input[type=password]').hover(function(){
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            if (!$(this).is(':focus')){
                                $(this).css('border-color', '');
                            }
                        });
                        
                        $('#main .content input[type=password]').focus(function(){
                            $(this).css('border-color', '#'+MainColor);
                        });
                        
                        $('#main .content input[type=password]').blur(function(){
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content textarea').hover(function(){
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            if (!$(this).is(':focus')){
                                $(this).css('border-color', '');
                            }
                        });
                        
                        $('#main .content textarea').focus(function(){
                            $(this).css('border-color', '#'+MainColor);
                        });
                        
                        $('#main .content textarea').blur(function(){
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content input[type=checkbox]').hover(function(){
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content input[type=radio]').hover(function(){
                            $(this).css('border-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('border-color', '');
                        });
                        
                        $('#main .content input[type=button]').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                        
                        $('#main .content input[type=reset]').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                        
                        $('#main .content input[type=submit]').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                        
                        $('#main .content a.button').hover(function(){
                            $(this).css({'background-color': '#'+MainColor,
                                         'color': '#e2e2e2'});
                        },
                        function(){
                            $(this).css({'background-color': '',
                                         'color': ''});
                        });
                                                
                        $('#main .content .pagination a').hover(function(){
                            $(this).css({'background-color': '#'+MainColor,
                                         'border-color': '#404040',
                                         'color': '#e2e2e2'});
                        },
                        function(){
                            $(this).css({'background-color': '',
                                         'border-color': '',
                                         'color': ''});
                        });
/* End Typhography */   

                        $('.web-icon').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                        
                        $('#main .content .has-info-icon').hover(function(){
                            $('.info-icon', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('.info-icon', this).css('background-color', '');
                        });


/* Begin Interactive Elements */
                        
                        $('#main .content .toggle-wrapper .toggle').hover(function(){
                            $('.sign', this).css('color', '#'+MainColor);
                        },
                        function(){
                            $('.sign', this).css('color', '');
                        });

/* End Interactive Elements */

/* Begin Blog */
                        $('#filters li').hover(function(){
                            $('.icon', this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $('.icon', this).css('background-color', '');
                        });
                        
                        $('#main .content .blog-content .post .post-metadata a').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                        
                        $('#main .content .blog-content.masonry .post.more a').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
    
                        $('#main .content .blog-content .post .post-title a').hover(function(){
                            $(this).css('color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('color', '');
                        });
                        
                        $('#main .content .blog-content #comments .comment .comment-hide').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                       
                        $('#main .content .blog-content #comments .comment .comment-reply').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
                       
                        $('#main .content #sidebar .widget h3').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });
/* End Blog */          
                        $('.social-link').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                            $('.tooltip', this).css('background-color', '#'+MainColor);
                            $('.tooltip .tooltip-arrow', this).css('border-top-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                            $('.tooltip', this).css('background-color', '');
                            $('.tooltip .tooltip-arrow', this).css('border-top-color', '');
                        });
                        
                        $('#close').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });             
                        
                        $('#gotop').hover(function(){
                            $(this).css('background-color', '#'+MainColor);
                        },
                        function(){
                            $(this).css('background-color', '');
                        });             
                    },
                    staticUseColors:function(){
                        $('.skill .progress').css('background-color', '#'+MainColor);
                        $('#main .content .tabs li.ui-state-active a').css('background-color', '#'+MainColor);
                        $('.DOP_WallGridGallery_ThumbIconLink .glyph-hover').css('color', '#'+MainColor);
                        $('.DOP_WallGridGallery_ThumbIconMedia .glyph-hover').css('color', '#'+MainColor);
                        
                        $('#filters li .text').css('background-color', '#'+MainColor);
                        $('#filters li.selected .icon').css('background-color', '#'+MainColor);
                        $('#main .content .blog-content .post .post-metadata a .tooltip').css('background-color', '#'+MainColor);
                        $('#main .content .blog-content .post .post-metadata a .tooltip .tooltip-arrow').css('border-top-color', '#'+MainColor);
                        
                        setTimeout(function(){
                            methods.staticUseColors();
                        }, 10);
                    },
                  
                    panelChangeBirds:function(){
                        birdsFlyFrom = $('#panel_birds_fly_from').val();
                        noBirds = $('#panel_no_birds').val();
                        $('#background-wrapper .landscape .birds').DOPBirds({'NoBirds': noBirds,
                                                                             'Width': $(window).width(),
                                                                             'Height': $(window).height(),
                                                                             'FlyFrom': birdsFlyFrom});
                        methods.saveData();
                    },
                         
                    saveData:function(){
                        var data = {"WebsiteType": websiteType,
                                    "ContentPosition": contentPosition,
                                    "Pattern": pattern,
                                    "BackgroundImage": backgroundImage,
                                    "BirdsFlyFrom": birdsFlyFrom,
                                    "NoBirds": noBirds,
                                    "MainColor": MainColor};

                        prototypes.setCookie('mr_goose_data', JSON.stringify(data), 1);
                    },
                         
                    getData:function(){
                        return JSON.parse(prototypes.readCookie('mr_goose_data'));
                    }
                  },

        prototypes = {
                        resizeItem:function(parent, child, cw, ch, dw, dh, pos){// Resize & Position an item (the item is 100% visible)
                            var currW = 0, currH = 0;

                            if (dw <= cw && dh <= ch){
                                currW = dw;
                                currH = dh;
                            }
                            else{
                                currH = ch;
                                currW = (dw*ch)/dh;

                                if (currW > cw){
                                    currW = cw;
                                    currH = (dh*cw)/dw;
                                }
                            }

                            child.width(currW);
                            child.height(currH);
                            switch(pos.toLowerCase()){
                                case 'top':
                                    prototypes.topItem(parent, child, ch);
                                    break;
                                case 'bottom':
                                    prototypes.bottomItem(parent, child, ch);
                                    break;
                                case 'left':
                                    prototypes.leftItem(parent, child, cw);
                                    break;
                                case 'right':
                                    prototypes.rightItem(parent, child, cw);
                                    break;
                                case 'horizontal-center':
                                    prototypes.hCenterItem(parent, child, cw);
                                    break;
                                case 'vertical-center':
                                    prototypes.vCenterItem(parent, child, ch);
                                    break;
                                case 'center':
                                    prototypes.centerItem(parent, child, cw, ch);
                                    break;
                                case 'top-left':
                                    prototypes.tlItem(parent, child, cw, ch);
                                    break;
                                case 'top-center':
                                    prototypes.tcItem(parent, child, cw, ch);
                                    break;
                                case 'top-right':
                                    prototypes.trItem(parent, child, cw, ch);
                                    break;
                                case 'middle-left':
                                    prototypes.mlItem(parent, child, cw, ch);
                                    break;
                                case 'middle-right':
                                    prototypes.mrItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-left':
                                    prototypes.blItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-center':
                                    prototypes.bcItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-right':
                                    prototypes.brItem(parent, child, cw, ch);
                                    break;
                            }
                        },
                        resizeItem2:function(parent, child, cw, ch, dw, dh, pos){// Resize & Position an item (the item covers all the container)
                            var currW = 0, currH = 0;

                            currH = ch;
                            currW = (dw*ch)/dh;

                            if (currW < cw){
                                currW = cw;
                                currH = (dh*cw)/dw;
                            }

                            child.width(currW);
                            child.height(currH);

                            switch(pos.toLowerCase()){
                                case 'top':
                                    prototypes.topItem(parent, child, ch);
                                    break;
                                case 'bottom':
                                    prototypes.bottomItem(parent, child, ch);
                                    break;
                                case 'left':
                                    prototypes.leftItem(parent, child, cw);
                                    break;
                                case 'right':
                                    prototypes.rightItem(parent, child, cw);
                                    break;
                                case 'horizontal-center':
                                    prototypes.hCenterItem(parent, child, cw);
                                    break;
                                case 'vertical-center':
                                    prototypes.vCenterItem(parent, child, ch);
                                    break;
                                case 'center':
                                    prototypes.centerItem(parent, child, cw, ch);
                                    break;
                                case 'top-left':
                                    prototypes.tlItem(parent, child, cw, ch);
                                    break;
                                case 'top-center':
                                    prototypes.tcItem(parent, child, cw, ch);
                                    break;
                                case 'top-right':
                                    prototypes.trItem(parent, child, cw, ch);
                                    break;
                                case 'middle-left':
                                    prototypes.mlItem(parent, child, cw, ch);
                                    break;
                                case 'middle-right':
                                    prototypes.mrItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-left':
                                    prototypes.blItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-center':
                                    prototypes.bcItem(parent, child, cw, ch);
                                    break;
                                case 'bottom-right':
                                    prototypes.brItem(parent, child, cw, ch);
                                    break;
                            }
                        },

                        topItem:function(parent, child, ch){// Position item on Top
                            parent.height(ch);
                            child.css('margin-top', 0);
                        },
                        bottomItem:function(parent, child, ch){// Position item on Bottom
                            parent.height(ch);
                            child.css('margin-top', ch-child.height());
                        },
                        leftItem:function(parent, child, cw){// Position item on Left
                            parent.width(cw);
                            child.css('margin-left', 0);
                        },
                        rightItem:function(parent, child, cw){// Position item on Right
                            parent.width(cw);
                            child.css('margin-left', parent.width()-child.width());
                        },
                        hCenterItem:function(parent, child, cw){// Position item on Horizontal Center
                            parent.width(cw);
                            child.css('margin-left', (cw-child.width())/2);
                        },
                        vCenterItem:function(parent, child, ch){// Position item on Vertical Center
                            parent.height(ch);
                            child.css('margin-top', (ch-child.height())/2);
                        },
                        centerItem:function(parent, child, cw, ch){// Position item on Center
                            prototypes.hCenterItem(parent, child, cw);
                            prototypes.vCenterItem(parent, child, ch);
                        },
                        tlItem:function(parent, child, cw, ch){// Position item on Top-Left
                            prototypes.topItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        tcItem:function(parent, child, cw, ch){// Position item on Top-Center
                            prototypes.topItem(parent, child, ch);
                            prototypes.hCenterItem(parent, child, cw);
                        },
                        trItem:function(parent, child, cw, ch){// Position item on Top-Right
                            prototypes.topItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        mlItem:function(parent, child, cw, ch){// Position item on Middle-Left
                            prototypes.vCenterItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        mrItem:function(parent, child, cw, ch){// Position item on Middle-Right
                            prototypes.vCenterItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        blItem:function(parent, child, cw, ch){// Position item on Bottom-Left
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        bcItem:function(parent, child, cw, ch){// Position item on Bottom-Center
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.hCenterItem(parent, child, cw);
                        },
                        brItem:function(parent, child, cw, ch){// Position item on Bottom-Right
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        
                        touchNavigation:function(parent, child){// One finger navigation for touchscreen devices
                            var prevX, prevY, currX, currY, touch, childX, childY;
                            
                            parent.bind('touchstart', function(e){
                                touch = e.originalEvent.touches[0];
                                prevX = touch.clientX;
                                prevY = touch.clientY;
                            });

                            parent.bind('touchmove', function(e){                                
                                touch = e.originalEvent.touches[0];
                                currX = touch.clientX;
                                currY = touch.clientY;
                                childX = currX>prevX ? parseInt(child.css('margin-left'))+(currX-prevX):parseInt(child.css('margin-left'))-(prevX-currX);
                                childY = currY>prevY ? parseInt(child.css('margin-top'))+(currY-prevY):parseInt(child.css('margin-top'))-(prevY-currY);

                                if (childX < (-1)*(child.width()-parent.width())){
                                    childX = (-1)*(child.width()-parent.width());
                                }
                                else if (childX > 0){
                                    childX = 0;
                                }
                                else{                                    
                                    e.preventDefault();
                                }

                                if (childY < (-1)*(child.height()-parent.height())){
                                    childY = (-1)*(child.height()-parent.height());
                                }
                                else if (childY > 0){
                                    childY = 0;
                                }
                                else{                                    
                                    e.preventDefault();
                                }

                                prevX = currX;
                                prevY = currY;

                                if (parent.width() < child.width()){
                                    child.css('margin-left', childX);
                                }
                                
                                if (parent.height() < child.height()){
                                    child.css('margin-top', childY);
                                }
                            });

                            parent.bind('touchend', function(e){
                                if (!prototypes.isChromeMobileBrowser()){
                                    e.preventDefault();
                                }
                            });
                        },

			rgb2hex:function(rgb){// Convert RGB color to HEX
                            var hexDigits = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

                            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

                            return (isNaN(rgb[1]) ? '00':hexDigits[(rgb[1]-rgb[1]%16)/16]+hexDigits[rgb[1]%16])+
                                   (isNaN(rgb[2]) ? '00':hexDigits[(rgb[2]-rgb[2]%16)/16]+hexDigits[rgb[2]%16])+
                                   (isNaN(rgb[3]) ? '00':hexDigits[(rgb[3]-rgb[3]%16)/16]+hexDigits[rgb[3]%16]);
			},
			idealTextColor:function(bgColor){// Set text color depending on the background color
			    var rgb = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(bgColor);
    
			    if (rgb != null){
			        return parseInt(rgb[1], 10)+parseInt(rgb[2], 10)+parseInt(rgb[3], 10) < 3*256/2 ? 'white' : 'black';
			    }
			    else{
			        return parseInt(bgColor.substring(0, 2), 16)+parseInt(bgColor.substring(2, 4), 16)+parseInt(bgColor.substring(4, 6), 16) < 3*256/2 ? 'white' : 'black';
			    }
			},

                        dateDiference:function(date1, date2){// Diference between 2 dates
                            var time1 = date1.getTime(),
                            time2 = date2.getTime(),
                            diff = Math.abs(time1-time2),
                            one_day = 1000*60*60*24;
                            
                            return parseInt(diff/(one_day))+1;
                        },
                        noDays:function(date1, date2){// Returns no of days between 2 days
                            var time1 = date1.getTime(),
                            time2 = date2.getTime(),
                            diff = Math.abs(time1-time2),
                            one_day = 1000*60*60*24;
                            
                            return Math.round(diff/(one_day))+1;
                        },
                        timeLongItem:function(item){// Return day/month with 0 in front if smaller then 10
                            if (item < 10){
                                return '0'+item;
                            }
                            else{
                                return item;
                            }
                        },
                        timeToAMPM:function(item){// Returns time in AM/PM format
                            var hour = parseInt(item.split(':')[0], 10),
                            minutes = item.split(':')[1],
                            result = '';
                            
                            if (hour == 0){
                                result = '12';
                            }
                            else if (hour > 12){
                                result = prototypes.timeLongItem(hour-12);
                            }
                            else{
                                result = prototypes.timeLongItem(hour);
                            }
                            
                            result += ':'+minutes+' '+(hour < 12 ? 'AM':'PM');
                            
                            return result;
                        },

                        stripslashes:function(str){// Remove slashes from string
                            return (str + '').replace(/\\(.?)/g, function (s, n1) {
                                switch (n1){
                                    case '\\':
                                        return '\\';
                                    case '0':
                                        return '\u0000';
                                    case '':
                                        return '';
                                    default:
                                        return n1;
                                }
                            });
                        },
                        
                        randomize:function(theArray){// Randomize the items of an array
                            theArray.sort(function(){
                                return 0.5-Math.random();
                            });
                            return theArray;
                        },
                        randomString:function(string_length){// Create a string with random elements
                            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
                            random_string = '';

                            for (var i=0; i<string_length; i++){
                                var rnum = Math.floor(Math.random()*chars.length);
                                random_string += chars.substring(rnum,rnum+1);
                            }
                            return random_string;
                        },

                        isIE8Browser:function(){// Detect the browser IE8
                            var isIE8 = false,
                            agent = navigator.userAgent.toLowerCase();

                            if (agent.indexOf('msie 8') != -1){
                                isIE8 = true;
                            }
                            return isIE8;
                        },
                        isIEBrowser:function(){// Detect the browser IE
                            var isIE = false,
                            agent = navigator.userAgent.toLowerCase();

                            if (agent.indexOf('msie') != -1){
                                isIE = true;
                            }
                            return isIE;
                        },
                        isChromeMobileBrowser:function(){// Detect the browser Mobile Chrome
                            var isChromeMobile = false,
                            agent = navigator.userAgent.toLowerCase();

                            if (agent.indexOf('crios') != -1){
                                isChromeMobile = true;
                            }
                            return isChromeMobile;
                        },
                        isTouchDevice:function(){// Detect touchscreen devices
                            var os = navigator.platform;
                            
                            if (os.toLowerCase().indexOf('win') != -1){
                                return window.navigator.msMaxTouchPoints;
                            }
                            else {
                                return 'ontouchstart' in document;
                            }
                        },

                        openLink:function(url, target){// Open a link
                            switch (target.toLowerCase()){
                                case '_blank':
                                    window.open(url);
                                    break;
                                case '_top':
                                    top.location.href = url;
                                    break;
                                case '_parent':
                                    parent.location.href = url;
                                    break;
                                default:    
                                    window.location = url;
                            }
                        },

                        validateCharacters:function(str, allowedCharacters){// Verify if a string contains allowed characters
                            var characters = str.split(''), i;

                            for (i=0; i<characters.length; i++){
                                if (allowedCharacters.indexOf(characters[i]) == -1){
                                    return false;
                                }
                            }
                            return true;
                        },
                        cleanInput:function(input, allowedCharacters, firstNotAllowed, min){// Remove characters that aren't allowed from a string
                            var characters = $(input).val().split(''),
                            returnStr = '', i, startIndex = 0;

                            if (characters.length > 1 && characters[0] == firstNotAllowed){
                                startIndex = 1;
                            }
                            
                            for (i=startIndex; i<characters.length; i++){
                                if (allowedCharacters.indexOf(characters[i]) != -1){
                                    returnStr += characters[i];
                                }
                            }
                                
                            if (min > returnStr){
                                returnStr = min;
                            }
                            
                            $(input).val(returnStr);
                        },
                        validEmail:function(email){// Validate email
                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            
                            if (filter.test(email)){
                                return true;
                            }
                            return false;
                        },
                        
                        $_GET:function(variable){// Parse $_GET variables
                            var url = window.location.href.split('?')[1],
                            variables = url != undefined ? url.split('&'):[],
                            i; 
                            
                            for (i=0; i<variables.length; i++){
                                if (variables[i].indexOf(variable) != -1){
                                    return variables[i].split('=')[1];
                                    break;
                                }
                            }
                            
                            return undefined;
                        },
                        acaoBuster:function(dataURL){// Access-Control-Allow-Origin buster
                            var topURL = window.location.href,
                            pathPiece1 = '', pathPiece2 = '';
                            
                            if (dataURL.indexOf('https') != -1 || dataURL.indexOf('http') != -1){
                                if (topURL.indexOf('http://www.') != -1){
                                    pathPiece1 = 'http://www.';
                                }
                                else if (topURL.indexOf('http://') != -1){
                                    pathPiece1 = 'http://';
                                }
                                else if (topURL.indexOf('https://www.') != -1){
                                    pathPiece1 = 'https://www.';
                                }
                                else if (topURL.indexOf('https://') != -1){
                                    pathPiece1 = 'https://';
                                }
                                    
                                if (dataURL.indexOf('http://www.') != -1){
                                    pathPiece2 = dataURL.split('http://www.')[1];
                                }
                                else if (dataURL.indexOf('http://') != -1){
                                    pathPiece2 = dataURL.split('http://')[1];
                                }
                                else if (dataURL.indexOf('https://www.') != -1){
                                    pathPiece2 = dataURL.split('https://www.')[1];
                                }
                                else if (dataURL.indexOf('https://') != -1){
                                    pathPiece2 = dataURL.split('https://')[1];
                                }
                                
                                return pathPiece1+pathPiece2;
                            }
                            else{
                                return dataURL;
                            }
                        },
                        
                        doHideBuster:function(item){// Make all parents & current item visible
                            var parent = item.parent(),
                            items = new Array();
                                
                            if (item.prop('tagName').toLowerCase() != 'body'){
                                items = prototypes.doHideBuster(parent);
                            }
                            
                            if (item.css('display') == 'none'){
                                item.css('display', 'block');
                                items.push(item);
                            }
                            
                            return items;
                        },
                        undoHideBuster:function(items){// Hide items in the array
                            var i;
                            
                            for (i=0; i<items.length; i++){
                                items[i].css('display', 'none');
                            }
                        },
                       
                        setCookie:function(c_name, value, expiredays){// Set cookie (name, value, expire in no days)
                            var exdate = new Date();
                            exdate.setDate(exdate.getDate()+expiredays);

                            document.cookie = c_name+"="+escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toUTCString())+";javahere=yes;path=/";
                        },
                        readCookie:function(name){// Read cookie (name) 
                            var nameEQ = name+"=",
                            ca = document.cookie.split(";");

                            for (var i=0; i<ca.length; i++){
                                var c = ca[i];

                                while (c.charAt(0)==" "){
                                    c = c.substring(1,c.length);            
                                } 

                                if (c.indexOf(nameEQ) == 0){
                                    return unescape(c.substring(nameEQ.length, c.length));
                                } 
                            }
                            return null;
                        },
                        deleteCookie:function(c_name, path, domain){// Delete cookie (name, path, domain)
                            if (readCookie(c_name)){
                                document.cookie = c_name+"="+((path) ? ";path="+path:"")+((domain) ? ";domain="+domain:"")+";expires=Thu, 01-Jan-1970 00:00:01 GMT";
                            }
                        }
                    };

        return methods.init.apply(this);
    }
})(jQuery);