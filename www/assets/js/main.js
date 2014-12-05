
var clearClick = true,
birdsCanvasNo = 0,
launchDateDay = launchDate.split(' ')[0],
launchDateTime = launchDate.split(' ')[1];
           
$(function(){
    $('body').DOPImageLoader({'Container':'.post-image',
                              'LoaderURL': 'libraries/images/dopil/loader.gif',
                              'NoImageURL': 'libraries/images/dopil/no-image.png',
                              'CacheBuster': false});
    $('body').DOPImageLoader({'Container':'.content-image',
                              'LoaderURL': 'libraries/images/dopil/loader.gif',
                              'NoImageURL': 'libraries/images/dopil/no-image.png',
                              'CacheBuster': false});
});
  
$(document).ready(function(){
    $('#panel').DOPPanel();
    $('#content-wrapper').css({'display': 'block'});
    
    $(window).scroll(function(){
        if ($(window).scrollTop() > 96){
            $('#gotop').css('display', 'block');
        }
        else{
            $('#gotop').css('display', 'none');
        }
    });
    
    $(window).resize(function(){
        rpContent();
    });

    $('#gotop').unbind('click');
    $('#gotop').bind('click', function(){
        $('body, html').stop(true, true).animate({'scrollTop': '0'}, 300);
    });
    
    initBackground(backgroundImage);
    initMobileMenu();
    initContent();
});

function initAjaxNavigation(){
    $('.ajax-link').unbind('click');
    $('.ajax-link').bind('click', function(e){
        var link = this;
        
        if (websiteType == 'ajax' && $(link).attr('href').indexOf('://') == -1 && $(link).attr('href').indexOf('javascript:') == -1 || $(link).attr('href') == ''){                
            e.preventDefault();
            
            try{
                window.history.pushState({'html': '', 'pageTitle': ''}, '', $(link).attr('href'));
            }catch(e){
                //console.log(e);
            }
            
            if (clearClick){
                $('#navigation-wrapper #menu > li > ul').fadeOut('fast', function(){
                    var item = this;
                    
                    setTimeout(function(){
                        $(item).removeAttr('style');
                    }, 100);
                });
                
                $('#navigation-wrapper #mobile-menu li').removeClass('visible');
                $('#header').css('display', 'none');
                $('#footer').css('display', 'none');
                
                $('#main').fadeOut('fast', function(){
                    $('#main').html('');
                    rpContent();
                    
                    if ($(link).attr('href') != ''){
                        $('#navigation-wrapper .loader').css('display', 'block');
                        clearClick = false;

                        $('#main').load($(link).attr('href')+' #main .content', function(){
                            $('#navigation-wrapper .loader').css('display', 'none');
                            clearClick = true;
                            
                            $('#panel').DOPPanel();

                            $('#main').fadeIn('slow');
                            $('body').DOPImageLoader({'Container':'.post-image',
                                                      'LoaderURL': 'libraries/images/dopil/loader.gif',
                                                      'NoImageURL': 'libraries/images/dopil/no-image.png',
                                                      'CacheBuster': false});
                            $('body').DOPImageLoader({'Container':'.content-image',
                                                      'LoaderURL': 'libraries/images/dopil/loader.gif',
                                                      'NoImageURL': 'libraries/images/dopil/no-image.png',
                                                      'CacheBuster': false});
                            initContent();
                        });
                    }
                });
            }
        }
    });
}

function initInteractiveElements(){
    $('#main .content .tabs').tabs();
    $('#main .content .accordion').accordion({collapsible: true, heightStyle: 'content'});
    
    $('#main .content .toggle-wrapper .toggle').unbind('click');
    $('#main .content .toggle-wrapper .toggle').bind('click', function(){
        $(this).closest('.toggle-wrapper').find('.toggle-content').fadeToggle('fast');
        
        if ($('.sign', this).hasClass('icon-67')){
            $('.sign', this).removeClass('icon-67');
            $('.sign', this).addClass('icon-69');
        }
        else{
            $('.sign', this).removeClass('icon-69');
            $('.sign', this).addClass('icon-67');
        }
    }); 
}

function initBlog(){
    var blogContent = $('.blog-content.masonry');
    
    if (blogContent.length != 1){
        blogContent = $('.blog-content.list');
    }
    
    if (blogContent.length == 1){
        $('#filters').css('display', 'block');
        $('#filters li:first-child').addClass('selected');

        blogContent.isotope({
            itemSelector : '.post',
            layoutMode : blogContent.selector == ('.blog-content.masonry') ? 'masonry':'fitRows'
        });

        $('#filters a').unbind('click');
        $('#filters a').bind('click', function(e){
            var selector = $(this).attr('data-filter');
            
            $('#filters li').removeClass('selected');
            $(this).parent().addClass('selected');

            blogContent.isotope({filter: selector});
        });
        
        if (blogContent.selector == ('.blog-content.list')){
            $('#main .content .blog-content.list .post .expand').unbind('click');
            $('#main .content .blog-content.list .post .expand').bind('click', function(){
                $('.post-content-wrapper', $(this).parent().parent().parent()).toggle('fast', function(){
                    blogContent.isotope('reLayout');
                });

                if ($('.glyph', this).hasClass('icon-325')){
                    $('.glyph', this).removeClass('icon-325');
                    $('.glyph-hover', this).removeClass('icon-325');
                    $('.glyph', this).addClass('icon-326');
                    $('.glyph-hover', this).addClass('icon-326');
                }
                else{
                    $('.glyph', this).removeClass('icon-326');
                    $('.glyph-hover', this).removeClass('icon-326');
                    $('.glyph', this).addClass('icon-325');
                    $('.glyph-hover', this).addClass('icon-325');
                }
            });
        }
    }
    else{
        $('#filters li').removeClass('selected');
        $('#filters').css('display', 'none');
    }
}

function loadBlogMasonry(url){
    if (clearClick){
        clearClick = false;
        $('.post.more a').addClass('blocked');

        $('.post.more a').load(url+' #main .content .blog-content.masonry', function(){
            var data = $(this).find('.post');
            
            clearClick = true;
            $(this).parent().html('').css({'display': 'none',
                                           'margin': 0});
            $('.blog-content.masonry').isotope('insert', data);

            $('body').DOPImageLoader({'Container':'.post-image',
                                      'LoaderURL': 'libraries/images/dopil/loader.gif',
                                      'NoImageURL': 'libraries/images/dopil/no-image.png',
                                      'CacheBuster': false});
        });
    }
}

function loadBlogList(url){
    if (clearClick){
        clearClick = false;
        $('.post.more a').html('&nbsp');
        $('.post.more a').addClass('loader');

        $('.post.more a').load(url+' #main .content .blog-content.list', function(){
            var data = $(this).find('.post');
            
            clearClick = true;
            $(this).parent().html('').css({'border': 'none',
                                           'display': 'none',
                                           'margin': 0});
            $('.blog-content.list').isotope('insert', data);
            
            $('#main .content .blog-content.list .post .expand').unbind('click');
            $('#main .content .blog-content.list .post .expand').bind('click', function(){
                console.log($(this).parent().parent())
                $('.post-content-wrapper', $(this).parent().parent().parent()).toggle('fast', function(){
                    $('.blog-content.list').isotope('reLayout');
                });

                if ($('.glyph', this).hasClass('icon-325')){
                    $('.glyph', this).removeClass('icon-325');
                    $('.glyph-hover', this).removeClass('icon-325');
                    $('.glyph', this).addClass('icon-326');
                    $('.glyph-hover', this).addClass('icon-326');
                }
                else{
                    $('.glyph', this).removeClass('icon-326');
                    $('.glyph-hover', this).removeClass('icon-326');
                    $('.glyph', this).addClass('icon-325');
                    $('.glyph-hover', this).addClass('icon-325');
                }
            });
            
            $('body').DOPImageLoader({'Container':'.post-image',
                                      'LoaderURL': 'libraries/images/dopil/loader.gif',
                                      'NoImageURL': 'libraries/images/dopil/no-image.png',
                                      'CacheBuster': false});
        });
    }
}

function initBlogComents(){
    $('#main .content .blog-content #comments .comment .comment-hide').unbind('click');
    $('#main .content .blog-content #comments .comment .comment-hide').bind('click', function(){
        $('.comment-content', $(this).parent()).toggle('fast');
        
        if ($('.icon .glyph', this).hasClass('icon-326')){
            $('.icon .glyph', this).removeClass('icon-326');
            $('.icon .glyph-hover', this).removeClass('icon-326');
            $('.icon .glyph', this).addClass('icon-325');
            $('.icon .glyph-hover', this).addClass('icon-325');
        }
        else{
            $('.icon .glyph', this).removeClass('icon-325');
            $('.icon .glyph-hover', this).removeClass('icon-325');
            $('.icon .glyph', this).addClass('icon-326');
            $('.icon .glyph-hover', this).addClass('icon-326');
        }
    }); 
}

function initSidebar(){
    $('#main .content #sidebar .widget h3').unbind('click');
    $('#main .content #sidebar .widget h3').bind('click', function(){
        $('.data', $(this).parent()).toggle('fast');
        
        if ($('.icon .glyph', this).hasClass('icon-326')){
            $('.icon .glyph', this).removeClass('icon-326');
            $('.icon .glyph-hover', this).removeClass('icon-326');
            $('.icon .glyph', this).addClass('icon-325');
            $('.icon .glyph-hover', this).addClass('icon-325');
        }
        else{
            $('.icon .glyph', this).removeClass('icon-325');
            $('.icon .glyph-hover', this).removeClass('icon-325');
            $('.icon .glyph', this).addClass('icon-326');
            $('.icon .glyph-hover', this).addClass('icon-326');
        }
    }); 
}

function initDOPWallGridGallery(){
    var SettingsDataType = 'JSON', SettingsFilePath = '',
    ContentDataType = 'JSON', ContentFilePath = '';
    
    $('.DOP_WallGridGallery_LightboxWrapper').remove();
    
    $('.DOPWallGridGallery-container').each(function(){
        if ($('.dopwgg-settings', this).hasClass('JSON')){
            SettingsDataType = 'JSON';
            SettingsFilePath = $('.dopwgg-settings', this).attr('href');
        }
        else if ($('.dopwgg-settings', this).hasClass('XML')){
            SettingsDataType = 'XML';
            SettingsFilePath = $('.dopwgg-settings', this).attr('href');
        }
        else{
            SettingsDataType = 'HTML';
        }
        
        if ($('.dopwgg-content', this).hasClass('JSON')){
            ContentDataType = 'JSON';
            ContentFilePath = $('.dopwgg-content', this).attr('href');
        }
        else if ($('.dopwgg-content', this).hasClass('XML')){
            ContentDataType = 'XML';
            ContentFilePath = $('.dopwgg-content', this).attr('href');
        }
        else{
            ContentFilePath = 'HTML';
        }
        
        $(this).DOPWallGridGallery({'SettingsDataType': SettingsDataType,
                                    'SettingsFilePath': SettingsFilePath,
                                    'ContentDataType': ContentDataType,
                                    'ContentFilePath': ContentFilePath});
    });
}

function initDOPThumbnailGallery(){
    var SettingsDataType = 'JSON', SettingsFilePath = '',
    ContentDataType = 'JSON', ContentFilePath = '';
    
    $('.DOP_ThumbnailGallery_LightboxWrapper').remove();
    
    $('.DOPThumbnailGallery-container').each(function(){
        if ($('.doptg-settings', this).hasClass('JSON')){
            SettingsDataType = 'JSON';
            SettingsFilePath = $('.doptg-settings', this).attr('href');
        }
        else if ($('.doptg-settings', this).hasClass('XML')){
            SettingsDataType = 'XML';
            SettingsFilePath = $('.doptg-settings', this).attr('href');
        }
        else{
            SettingsDataType = 'HTML';
        }
        
        if ($('.doptg-content', this).hasClass('JSON')){
            ContentDataType = 'JSON';
            ContentFilePath = $('.doptg-content', this).attr('href');
        }
        else if ($('.doptg-content', this).hasClass('XML')){
            ContentDataType = 'XML';
            ContentFilePath = $('.doptg-content', this).attr('href');
        }
        else{
            ContentFilePath = 'HTML';
        }
        
        $(this).DOPThumbnailGallery({'SettingsDataType': SettingsDataType,
                                     'SettingsFilePath': SettingsFilePath,
                                     'ContentDataType': ContentDataType,
                                     'ContentFilePath': ContentFilePath});
 
   });
}

function initDOPThumbnailScroller(){
    var SettingsDataType = 'JSON', SettingsFilePath = '',
    ContentDataType = 'JSON', ContentFilePath = '';
    
    $('.DOP_ThumbnailScroller_LightboxWrapper').remove();
    
    $('.DOPThumbnailScroller-container').each(function(){
        if ($('.dopts-settings', this).hasClass('JSON')){
            SettingsDataType = 'JSON';
            SettingsFilePath = $('.dopts-settings', this).attr('href');
        }
        else if ($('.dopts-settings', this).hasClass('XML')){
            SettingsDataType = 'XML';
            SettingsFilePath = $('.dopts-settings', this).attr('href');
        }
        else{
            SettingsDataType = 'HTML';
        }
        
        if ($('.dopts-content', this).hasClass('JSON')){
            ContentDataType = 'JSON';
            ContentFilePath = $('.dopts-content', this).attr('href');
        }
        else if ($('.dopts-content', this).hasClass('XML')){
            ContentDataType = 'XML';
            ContentFilePath = $('.dopts-content', this).attr('href');
        }
        else{
            ContentFilePath = 'HTML';
        }
        
        $(this).DOPThumbnailScroller({'SettingsDataType': SettingsDataType,
                                      'SettingsFilePath': SettingsFilePath,
                                      'ContentDataType': ContentDataType,
                                      'ContentFilePath': ContentFilePath});
    });
}

function initTwitter(){
    $("#tweets").tweet({
        username: twitterUser,
        join_text: "auto",
        avatar_size: 48,
        count: 3,
        auto_join_text_default: "we said,", 
        auto_join_text_ed: "we",
        auto_join_text_ing: "we were",
        auto_join_text_reply: "we replied to",
        auto_join_text_url: "we were checking out",
        loading_text: "loading tweets…"
    });
}

function initFlicker(){
    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?id='+flickrID+'&format=json&jsoncallback=?', function(data){
        var i, pic, liNumber;

        for (i=0; i<9; i++){
            pic = data.items[i];
            liNumber = i+1;
            $('#latest-flickr-images').append('<li class="flickr-image no-'+liNumber+'"><a title="'+pic.title+'" href="'+pic.link+'" target="_blank"><img src="'+pic.media.m+'" /></a></li>');
        }
    });
}

function initGoogleMap(id, address, zoom){
    if ($('#'+id).width() != null){
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({'address': address}, function(results, status){
            var aCoord = results[0].geometry.location,

            styles = [{"stylers": [{"saturation": -100}]}],
            styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            mapOptions ={
                center: aCoord,
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions:{
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            },

            map = new google.maps.Map(document.getElementById(id), mapOptions),

            marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');
        });
    }
}

// ***************************************************************************** Begin Background */

function initBackground(image){
    backgroundImage = image;
    $('#navigation-wrapper .loader').css('display', 'block');
    $('#background-wrapper .landscape').removeClass('default')
                                       .removeClass('bridge')
                                       .removeClass('church')
                                       .removeClass('city')
                                       .removeClass('forest')
                                       .removeClass('ship')
                                       .removeClass('train')
                                       .removeClass('windmill')
                                       .removeClass('wolf')
                                       .addClass(image)
                                       .css('opacity', 0);
    $('#background-wrapper .foreground').html('');
    loadBackground(1);
}

function loadBackground(step){
    var img = new Image(),
    imagePath;
    
    switch (step){
        case 1:
            imagePath = 'assets/gui/images/background-images/'+backgroundImage+'/light.png';
            break;   
        case 2:
            imagePath = 'assets/gui/images/background-images/'+backgroundImage+'/'+contentPosition+'-foreground.png';
            break; 
    }
    
    $(img).load(function(){
        switch (step){
            case 1:
                $('#background-wrapper .light').html(this);
                loadBackground(2);
                break;   
            case 2:
                $('#background-wrapper .foreground').html(this);
                endBackground();
                break; 
        }
    }).error(function(){
        switch (step){
            case 1:
                loadBackground(2);
                break;   
            case 2:
                endBackground();
                break; 
        }
    }).attr("src", imagePath);
}

function endBackground(){
    $('#navigation-wrapper .loader').css('display', 'none');
    
    $('#background-wrapper .landscape .birds').DOPBirds({'NoBirds': noBirds,
                                                         'Width': $(window).width(),
                                                         'Height': $(window).height(),
                                                         'FlyFrom': birdsFlyFrom});
    
    $('#background-wrapper .landscape').stop(true, true).animate({'opacity':1}, 600);
}

// ***************************************************************************** End Background

function initContent(){
    initAjaxNavigation();
    initInteractiveElements(); 
    initBlog();
    initBlogComents();
    initSidebar();
    initDOPWallGridGallery();
    initDOPThumbnailGallery();
    initDOPThumbnailScroller();
    myJavaScriptCode();
    
    if ($('#main .content').html() != undefined){
        $('#header').css('display', 'block');
        $('#footer').css('display', 'block');
    }
    
    
    $('#countdown').countdown({until: new Date(parseInt(launchDateDay.split('-')[0]),
                                               parseInt(launchDateDay.split('-')[1])-1,
                                               parseInt(launchDateDay.split('-')[2]),
                                               parseInt(launchDateTime.split(':')[0]),
                                               parseInt(launchDateTime.split(':')[1]),
                                               parseInt(launchDateTime.split(':')[2])),
                               format: 'YOWDHMS',
                               labels: launchDateLabels,
                               labels1: launchDateLabelsForOne});
    initTwitter();
    initFlicker();
    initGoogleMap('map', contactAddress, 13);
    rpContent();
}

function initMobileMenu(){
    $('#navigation-wrapper #mobile-menu li a').unbind('click');
    $('#navigation-wrapper #mobile-menu li a').bind('click', function(){
        var parent = $(this).parent();
        if (parent.hasClass('visible')){
            parent.removeClass('visible');
        }
        else{
            parent.addClass('visible');
        }
        
        $('li', parent).removeClass('visible');
    });
}

function showFAQ(type){
    $('.faq-menu a').removeClass('selected');
    
    if (type == ''){
        $('#faq-filter-all').addClass('selected');
    }
    else{
        $('#faq-filter-'+type).addClass('selected');
    }
    
    $('.faq-item').each(function(){
        if (type != ''){
            if ($(this).hasClass(type)){
                $(this).fadeIn('fast');
            }
            else{
                $(this).fadeOut('fast', function(){
                    if ($(this).closest('.toggle-wrapper').find('.toggle-content').css('display') == 'block'){
                        $(this).closest('.toggle-wrapper').find('.toggle-content').fadeToggle('fast');
                        $(this).closest('.toggle-wrapper').find('.sign').removeClass('icon-69').addClass('icon-67');
                    }
                });
            }
        }
        else{
            $(this).fadeIn('fast');
        }
    });   
}

function rpContent(){
    $('#main .content').css('height', '');
    
    if ($(window).width() > 1339){
        $('#main .content').css('padding-top', 23+$('#header').height());
    }
    else{
        $('#main .content').css('padding-top', 24);
    }
    
    if ($(window).width() > 763){
        $('#main .content').css('padding-bottom', $('#footer').height()-1);
    }
    else{
        $('#main .content').css('padding-bottom', 0);;
    }
    
    if ($(window).width() < 1340){
        if ($('#main .content').height() < $(window).height()-$('#navigation-wrapper').height()-parseFloat($('#main .content').css('padding-top'))-parseFloat($('#main .content').css('padding-bottom'))-48){
            $('#main .content').height($(window).height()-$('#navigation-wrapper').height()-parseFloat($('#main .content').css('padding-top'))-parseFloat($('#main .content').css('padding-bottom'))-48);
        }
    }
    else{
        if ($('#main .content').height() < $(window).height()-parseFloat($('#main .content').css('padding-top'))-parseFloat($('#main .content').css('padding-bottom'))-48){
            $('#main .content').height($(window).height()-parseFloat($('#main .content').css('padding-top'))-parseFloat($('#main .content').css('padding-bottom'))-48);
        }
    }
    
    if ($(window).width() < 1340 && ($('#main').html() == '' || $('#main').height() < $(window).height()-$('#navigation-wrapper').height()-$('#footer').height()-parseFloat($('#footer').css('padding-top'))-parseFloat($('#footer').css('padding-bottom'))-48)){
        $('#footer').css({'bottom': 0,
                          'position': 'fixed'});
    }
    else{
        $('#footer').css({'bottom': '',
                          'position': ''});
    }
}

// ***************************************************************************** Subscribe & Contact functions

function contact(){
    
    var valid = true;
    
    if ($('#contact_name').val() == '' || $('#contact_name').val() == 'Your name'){
        valid = false;
    }
    
    if (!validEmail($('#contact_email').val()) || $('#contact_email').val() == 'Your email'){
        valid = false;
    }
    
    if ($('#contact_message').val() == '' || $('#contact_message').val() == 'Your message'){
        valid = false;
    }
    
    if (valid){
        $('#valid-contact').fadeIn('fast');
        
        $.post('assets/php/contact.php', {name: $('#contact_name').val(),
                                          email: $('#contact_email').val(),
                                          message: $('#contact_message').val()});
        
        $('#contact_name').val('');
        $('#contact_email').val('');
        $('#contact_message').val('');

        setTimeout(function(){
            $('#valid-contact').fadeOut('fast', function(){
                $('#info-contact').css('display', 'block');
            });
        }, 1500);
    }
    else{
        $('#invalid-contact').fadeIn('fast');
        
        setTimeout(function(){
            $('#invalid-contact').fadeOut('fast', function(){
                $('#info-contact').css('display', 'block');
            });
        }, 2500);
    }
    
    return false;
}

function validEmail(email){
    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (filter.test(email)){
        return true;
    }

    return false;
}

function myJavaScriptCode(){
    // My JavaScript Code
}