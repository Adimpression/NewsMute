
/*
* Title                   : Thumbnail Gallery (jQuery Plugin)
* Version                 : 1.6
* File                    : jquery.dop.ThumbnailGallery.js
* File Version            : 1.6
* Created / Last Modified : 20 January 2013
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Thumbnail Gallery jQuery Plugin.
*/

(function($){
    $.fn.DOPThumbnailGallery = function(options){
        var Data = {'ID': 1,
                    'SettingsDataType': 'JSON',
                    'SettingsFilePath': 'DOPThumbnailGallery/json/settings.json',
                    'ContentDataType': 'JSON',
                    'ContentFilePath':'DOPThumbnailGallery/json/content.json'},
       
        Container = this,
        ID = '0',
                                
        Width = '100%',
        Height = '100%',        
        BgColor = 'f1f1f1',
        BgAlpha = 100,
        ImagesOrder = 'normal',
        ResponsiveEnabled = 'true',

        ThumbnailsPosition = 'bottom',
        ThumbnailsOverImage = 'false',
        ThumbnailsBgColor = 'f1f1f1',
        ThumbnailsBgAlpha = 100,
        ThumbnailsSpacing = 5,
        ThumbnailsPaddingTop = 0,
        ThumbnailsPaddingRight = 5,
        ThumbnailsPaddingBottom = 5,
        ThumbnailsPaddingLeft = 5,
        
        ThumbnailsNavigation = 'mouse',
        ThumbnailsNavigationPrev = 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrev.png',
        ThumbnailsNavigationPrevHover = 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrevHover.png',
        ThumbnailsNavigationNext = 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNext.png',
        ThumbnailsNavigationNextHover = 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNextHover.png',
        
        ThumbnailLoader = 'DOPThumbnailGallery/assets/gui/images/ThumbnailLoader.gif',
        ThumbnailWidth = 60,
        ThumbnailHeight = 60,
        ThumbnailWidthDesktop = 60,
        ThumbnailHeightDesktop = 60,
        ThumbnailWidthMobile = 60,
        ThumbnailHeightMobile = 60,
        ThumbnailAlpha = 50,
        ThumbnailAlphaHover = 100,
        ThumbnailAlphaSelected = 100,
        ThumbnailBgColor = 'f1f1f1',
        ThumbnailBgColorHover = '000000',
        ThumbnailBgColorSelected = '000000',
        ThumbnailBorderSize = 2,
        ThumbnailBorderColor = 'f1f1f1',
        ThumbnailBorderColorHover = '000000',
        ThumbnailBorderColorSelected = '000000',
        ThumbnailPaddingTop = 0,
        ThumbnailPaddingRight = 0,
        ThumbnailPaddingBottom = 0,
        ThumbnailPaddingLeft = 0,

        ImageLoader = 'DOPThumbnailGallery/assets/gui/images/ImageLoader.gif',
        ImageBgColor = 'afafaf',
        ImageBgAlpha = 100,
        ImageDisplayType = 'fit',
        ImageDisplayTime = 1000,
        ImageMarginTop = 20,
        ImageMarginRight = 20,
        ImageMarginBottom = 20,
        ImageMarginLeft = 20,
        ImagePaddingTop = 5,
        ImagePaddingRight = 5,
        ImagePaddingBottom = 5,        
        ImagePaddingLeft = 5,
        
        NavigationEnabled = 'true',
        NavigationOverImage = 'true',
        NavigationPrev = 'DOPThumbnailGallery/assets/gui/images/Prev.png',
        NavigationPrevHover = 'DOPThumbnailGallery/assets/gui/images/PrevHover.png',
        NavigationNext = 'DOPThumbnailGallery/assets/gui/images/Next.png',
        NavigationNextHover = 'DOPThumbnailGallery/assets/gui/images/NextHover.png',
        NavigationLightbox = 'DOPThumbnailGallery/assets/gui/images/Lightbox.png',
        NavigationLightboxHover = 'DOPThumbnailGallery/assets/gui/images/LightboxHover.png',
        NavigationTouchDeviceSwipeEnabled = 'true',

        CaptionWidth = 900,
        CaptionHeight = 70,
        CaptionTitleColor = '000000',
        CaptionTextColor = '000000',
        CaptionBgColor = 'ffffff',
        CaptionBgAlpha = 50,
        CaptionPosition = 'bottom',
        CaptionOverImage = 'true',
        CaptionScrollScrubColor = '777777',
        CaptionScrollBgColor = 'e0e0e0',
        CaptionMarginTop = 0,
        CaptionMarginRight = 0,
        CaptionMarginBottom = 0,
        CaptionMarginLeft = 0,
        CaptionPaddingTop = 10,
        CaptionPaddingRight = 10,
        CaptionPaddingBottom = 10,
        CaptionPaddingLeft = 10,
        
        LightboxEnabled = 'true',
        LightboxWindowColor = '000000',
        LightboxWindowAlpha = 80,
        LightboxLoader = 'DOPThumbnailGallery/assets/gui/images/LightboxLoader.gif',
        LightboxBgColor = '000000',
        LightboxBgAlpha = 100,
        LightboxMarginTop = 70,
        LightboxMarginRight = 70,
        LightboxMarginBottom = 70,
        LightboxMarginLeft = 70,
        LightboxPaddingTop = 10,
        LightboxPaddingRight = 10,
        LightboxPaddingBottom = 10,
        LightboxPaddingLeft = 10,
        
        LightboxNavigationPrev = 'DOPThumbnailGallery/assets/gui/images/LightboxPrev.png',
        LightboxNavigationPrevHover = 'DOPThumbnailGallery/assets/gui/images/LightboxPrevHover.png',
        LightboxNavigationNext = 'DOPThumbnailGallery/assets/gui/images/LightboxNext.png',
        LightboxNavigationNextHover = 'DOPThumbnailGallery/assets/gui/images/LightboxNextHover.png',
        LightboxNavigationClose = 'DOPThumbnailGallery/assets/gui/images/LightboxClose.png',
        LightboxNavigationCloseHover = 'DOPThumbnailGallery/assets/gui/images/LightboxCloseHover.png',
        LightboxNavigationInfoBgColor = '000000',
        LightboxNavigationInfoTextColor = 'dddddd',
        LightboxNavigationTouchDeviceSwipeEnabled = 'true',
        
        SocialShareEnabled = 'true',
        SocialShare = 'DOPThumbnailGallery/assets/gui/images/SocialShare.png',
        SocialShareLightbox = 'DOPThumbnailGallery/assets/gui/images/SocialShareLightbox.png',
        
        TooltipEnabled = 'false',
        TooltipBgColor = 'ffffff',
        TooltipStrokeColor = '000000',
        TooltipTextColor = '000000',
        
        Slideshow = 'false',
        SlideshowTime = 5000,
        SlideshowAutostart = 'true',
        SlideshowLoop = 'true',
        SlideshowPlay = 'DOPThumbnailGallery/assets/gui/images/Play.png',
        SlideshowPlayHover = 'DOPThumbnailGallery/assets/gui/images/PlayHover.png',
        SlideshowPause = 'DOPThumbnailGallery/assets/gui/images/Pause.png',
        SlideshowPauseHover = 'DOPThumbnailGallery/assets/gui/images/PauseHover.png',

        AutoHide = 'false',
        AutoHideTime = 2000,
        
        ThumbnailsPositionTime = 600,
        LightboxDisplayTime = 600,
        LightboxNavigationDisplayTime = 600,
        AutoHideDisplayTime = 600,
        
        Images = new Array(),
        Thumbs = new Array(),
        ThumbsWidth = new Array(),
        ThumbsHeight = new Array(),
        CaptionTitle = new Array(),
        CaptionText = new Array(),
        Media = new Array(),
        LightboxMedia = new Array(),
        noImages = 0,
        
        startGalleryID = 0,
        startWith = 1,
        startWithLightbox = false,
        
        initialWidth = Width,
        initialHeight = Height,
                
        MoveThumbnailsLeftID,
        MoveThumbnailsRightID,

        currentThumb = 0,
        thumbsDisplayed = false,
        currentImage = 0,
        imageLoaded = false,
        ImageWidth = 0,
        ImageHeight = 0,
        
        lightboxCurrentImage = 0,
        lightboxImageLoaded = false,
        lightboxImageWidth = 0,
        lightboxImageHeight = 0,

        SlideshowID,
        SlideshowStatus = 'play',

        HideID,
        ItemsHidden,

        socialShareInterval,

        methods = {
                    init:function(){// Init Plugin.
                        return this.each(function(){
                            if (options){
                                $.extend(Data, options);
                            }
                                                        
                            ID = Data['ID'];
                            
                            if (Data['SettingsDataType'] == 'XML'){
                                methods.parseXMLSettings();
                            }
                            else if (Data['SettingsDataType'] == 'JSON'){
                                methods.parseJSONSettings();                                
                            }
                            else{
                                methods.parseHTMLSettings();
                            }
                            $(window).bind('resize.DOPThumbnailGallery', methods.initRP);
                            $(window).bind('scroll.DOPThumbnailGallery', methods.initRPScroll);
                        });
                    },
                    parseJSONSettings:function(){// Parse Settings.                        
                        $.getJSON(prototypes.acaoBuster(Data['SettingsFilePath']), {}, function(data){  
                            Width = data['Width'] || '100%';
                            Height = data['Height'] || '100%';
                            BgColor = data['BgColor'] || 'f1f1f1';
                            BgAlpha = parseInt(data['BgAlpha']);
                            ImagesOrder = data['ImagesOrder'] || 'normal';
                            ResponsiveEnabled = data['ResponsiveEnabled'] || 'true';
                            
                            ThumbnailsPosition = data['ThumbnailsPosition'] || 'bottom';
                            ThumbnailsOverImage = data['ThumbnailsOverImage'] || 'false';
                            ThumbnailsBgColor = data['ThumbnailsBgColor'] || 'f1f1f1';
                            ThumbnailsBgAlpha = parseInt(data['ThumbnailsBgAlpha']);
                            ThumbnailsSpacing = parseInt(data['ThumbnailsSpacing']);
                            ThumbnailsPaddingTop = parseInt(data['ThumbnailsPaddingTop']);
                            ThumbnailsPaddingRight = parseInt(data['ThumbnailsPaddingRight']);
                            ThumbnailsPaddingBottom = parseInt(data['ThumbnailsPaddingBottom']);
                            ThumbnailsPaddingLeft = parseInt(data['ThumbnailsPaddingLeft']);
                                                                
                            ThumbnailsNavigation = data['ThumbnailsNavigation'] || 'mouse';
                            ThumbnailsNavigationPrev = data['ThumbnailsNavigationPrev'] || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrev.png';
                            ThumbnailsNavigationPrevHover = data['ThumbnailsNavigationPrevHover'] || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrevHover.png';
                            ThumbnailsNavigationNext = data['ThumbnailsNavigationNext'] || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNext.png';
                            ThumbnailsNavigationNextHover = data['ThumbnailsNavigationNextHover'] || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNextHover.png';
                            
                            ThumbnailLoader = data['ThumbnailLoader'] || 'DOPThumbnailGallery/assets/gui/images/ThumbnailLoader.gif';
                            ThumbnailWidth = parseInt(data['ThumbnailWidth']);
                            ThumbnailHeight = parseInt(data['ThumbnailHeight']);
                            ThumbnailWidthDesktop = parseInt(data['ThumbnailWidth']);
                            ThumbnailHeightDesktop = parseInt(data['ThumbnailHeight']);
                            ThumbnailWidthMobile = parseInt(data['ThumbnailWidthMobile']);
                            ThumbnailHeightMobile = parseInt(data['ThumbnailHeightMobile']);
                            ThumbnailAlpha = parseInt(data['ThumbnailAlpha']);
                            ThumbnailAlphaHover = parseInt(data['ThumbnailAlphaHover']);
                            ThumbnailAlphaSelected = parseInt(data['ThumbnailAlphaSelected']);
                            ThumbnailBgColor = data['ThumbnailBgColor'] || 'f1f1f1';
                            ThumbnailBgColorHover = data['ThumbnailBgColorHover'] || '000000';
                            ThumbnailBgColorSelected = data['ThumbnailBgColorSelected'] || '000000';
                            ThumbnailBorderSize = parseInt(data['ThumbnailBorderSize']);
                            ThumbnailBorderColor = data['ThumbnailBorderColor'] || 'f1f1f1';
                            ThumbnailBorderColorHover = data['ThumbnailBorderColorHover'] || '000000';
                            ThumbnailBorderColorSelected = data['ThumbnailBorderColorSelected'] || '000000';
                            ThumbnailPaddingTop = parseInt(data['ThumbnailPaddingTop']);
                            ThumbnailPaddingRight = parseInt(data['ThumbnailPaddingRight']);
                            ThumbnailPaddingBottom = parseInt(data['ThumbnailPaddingBottom']);
                            ThumbnailPaddingLeft = parseInt(data['ThumbnailPaddingLeft']);
                                                        
                            ImageLoader = data['ImageLoader'] || 'DOPThumbnailGallery/assets/gui/images/ImageLoader.gif';
                            ImageBgColor = data['ImageBgColor'] || 'afafaf';
                            ImageBgAlpha = parseInt(data['ImageBgAlpha']);
                            ImageDisplayType = data['ImageDisplayType'] || 'fit';
                            ImageDisplayTime = parseInt(data['ImageDisplayTime']);
                            ImageMarginTop = parseInt(data['ImageMarginTop']);
                            ImageMarginRight = parseInt(data['ImageMarginRight']);
                            ImageMarginBottom = parseInt(data['ImageMarginBottom']);
                            ImageMarginLeft = parseInt(data['ImageMarginLeft']);
                            ImagePaddingTop = parseInt(data['ImagePaddingTop']);
                            ImagePaddingRight = parseInt(data['ImagePaddingRight']);
                            ImagePaddingBottom = parseInt(data['ImagePaddingBottom']);
                            ImagePaddingLeft = parseInt(data['ImagePaddingLeft']);
                                                        
                            NavigationEnabled = data['NavigationEnabled'] || 'true';
                            NavigationOverImage = data['NavigationOverImage'] || 'true';
                            NavigationPrev = data['NavigationPrev'] || 'DOPThumbnailGallery/assets/gui/images/Prev.png';
                            NavigationPrevHover = data['NavigationPrevHover'] || 'DOPThumbnailGallery/assets/gui/images/PrevHover.png';
                            NavigationNext = data['NavigationNext'] || 'DOPThumbnailGallery/assets/gui/images/Next.png';
                            NavigationNextHover = data['NavigationNextHover'] || 'DOPThumbnailGallery/assets/gui/images/NextHover.png';
                            NavigationLightbox = data['NavigationLightbox'] || 'DOPThumbnailGallery/assets/gui/images/Lightbox.png';
                            NavigationLightboxHover = data['NavigationLightboxHover'] || 'DOPThumbnailGallery/assets/gui/images/LightboxHover.png';
                            NavigationTouchDeviceSwipeEnabled = data['NavigationTouchDeviceSwipeEnabled'] || 'true';
                            
                            CaptionWidth = parseInt(data['CaptionWidth']);
                            CaptionHeight = parseInt(data['CaptionHeight']);
                            CaptionTitleColor = data['CaptionTitleColor'] || '000000';
                            CaptionTextColor = data['CaptionTextColor'] || '000000';
                            CaptionBgColor = data['CaptionBgColor'] || 'ffffff';
                            CaptionBgAlpha = parseInt(data['CaptionBgAlpha']);
                            CaptionPosition = data['CaptionPosition'] || 'bottom';
                            CaptionOverImage = data['CaptionOverImage'] || 'true';
                            CaptionScrollScrubColor = data['CaptionScrollScrubColor'] || '777777';
                            CaptionScrollBgColor = data['CaptionScrollBgColor'] || 'e0e0e0';
                            CaptionMarginTop = parseInt(data['CaptionMarginTop']);
                            CaptionMarginRight = parseInt(data['CaptionMarginRight']);
                            CaptionMarginBottom = parseInt(data['CaptionMarginBottom']);
                            CaptionMarginLeft = parseInt(data['CaptionMarginLeft']);
                            CaptionPaddingTop = parseInt(data['CaptionPaddingTop']);
                            CaptionPaddingRight = parseInt(data['CaptionPaddingRight']);
                            CaptionPaddingBottom = parseInt(data['CaptionPaddingBottom']);
                            CaptionPaddingLeft = parseInt(data['CaptionPaddingLeft']);
                                                        
                            LightboxEnabled = data['LightboxEnabled'] || 'true';
                            LightboxWindowColor = data['LightboxWindowColor'] || '000000';
                            LightboxWindowAlpha = parseInt(data['LightboxWindowAlpha']);
                            LightboxLoader = data['LightboxLoader'] || 'DOPThumbnailGallery/assets/gui/images/LightboxLoader.gif';
                            LightboxBgColor = data['LightboxBgColor'] || '000000';
                            LightboxBgAlpha = parseInt(data['LightboxBgAlpha']);
                            LightboxMarginTop = parseInt(data['LightboxMarginTop']);
                            LightboxMarginRight = parseInt(data['LightboxMarginRight']);
                            LightboxMarginBottom = parseInt(data['LightboxMarginBottom']);
                            LightboxMarginLeft = parseInt(data['LightboxMarginLeft']);
                            LightboxPaddingTop = parseInt(data['LightboxPaddingTop']);
                            LightboxPaddingRight = parseInt(data['LightboxPaddingRight']);
                            LightboxPaddingBottom = parseInt(data['LightboxPaddingBottom']);
                            LightboxPaddingLeft = parseInt(data['LightboxPaddingLeft']);
                                                        
                            LightboxNavigationPrev = data['LightboxNavigationPrev'] || 'DOPThumbnailGallery/assets/gui/images/LightboxPrev.png';
                            LightboxNavigationPrevHover = data['LightboxNavigationPrevHover'] || 'DOPThumbnailGallery/assets/gui/images/LightboxPrevHover.png';
                            LightboxNavigationNext = data['LightboxNavigationNext'] || 'DOPThumbnailGallery/assets/gui/images/LightboxNext.png';
                            LightboxNavigationNextHover = data['LightboxNavigationNextHover'] || 'DOPThumbnailGallery/assets/gui/images/LightboxNextHover.png';
                            LightboxNavigationClose = data['LightboxNavigationClose'] || 'DOPThumbnailGallery/assets/gui/images/LightboxClose.png';
                            LightboxNavigationCloseHover = data['LightboxNavigationCloseHover'] || 'DOPThumbnailGallery/assets/gui/images/LightboxCloseHover.png';
                            LightboxNavigationInfoBgColor = data['LightboxNavigationInfoBgColor'] || '000000';
                            LightboxNavigationInfoTextColor = data['LightboxNavigationInfoTextColor'] || 'dddddd';
                            LightboxNavigationTouchDeviceSwipeEnabled = data['LightboxNavigationTouchDeviceSwipeEnabled'] || 'true';
                            
                            SocialShareEnabled = data['SocialShareEnabled'] || 'true';
                            SocialShare = data['SocialShare'] || 'DOPThumbnailGallery/assets/gui/images/SocialShare.png',
                            SocialShareLightbox = data['SocialShareLightbox'] || 'DOPThumbnailGallery/assets/gui/images/SocialShareLightbox.png',
                                                                                    
                            TooltipEnabled = data['TooltipEnabled'] || 'false';
                            TooltipBgColor = data['TooltipBgColor'] || 'ffffff';
                            TooltipStrokeColor = data['TooltipStrokeColor'] || '000000';
                            TooltipTextColor = data['TooltipTextColor'] || '000000';
                            
                            Slideshow = data['Slideshow'] || 'false';
                            SlideshowTime = parseInt(data['SlideshowTime']);
                            SlideshowAutostart = data['SlideshowAutostart'] || 'true';
                            SlideshowLoop = data['SlideshowLoop'] || 'true';
                            SlideshowPlay = data['SlideshowPlay'] || 'DOPThumbnailGallery/assets/gui/images/Play.png';
                            SlideshowPlayHover = data['SlideshowPlayHover'] || 'DOPThumbnailGallery/assets/gui/images/PlayHover.png';
                            SlideshowPause = data['SlideshowPause'] || 'DOPThumbnailGallery/assets/gui/images/Pause.png';
                            SlideshowPauseHover = data['SlideshowPauseHover'] || 'DOPThumbnailGallery/assets/gui/images/PauseHover.png';
                            
                            AutoHide = data['AutoHide'] || 'false';
                            AutoHideTime = parseInt(data['AutoHideTime']);
                                                    
                            if (SlideshowAutostart == 'true'){
                                SlideshowStatus = 'play';                                
                            }
                            else{
                                SlideshowStatus = 'pause';
                            }
                            
                            if (Data['ContentDataType'] == 'XML'){
                                methods.parseXMLContent();
                            }
                            else if (Data['ContentDataType'] == 'JSON'){
                                methods.parseJSONContent();                                
                            }
                            else{
                                methods.parseHTMLContent();
                            }
                        });
                    },
                    parseXMLSettings:function(){// Parse the Settings XML.
                        $.ajax({type:"GET", url:prototypes.acaoBuster(Data['SettingsFilePath']), dataType:"xml", success:function(xml){
                            var $xml = $(xml);
                                                        
                            Width = $xml.find('Width').text() || '100%';
                            Height = $xml.find('Height').text() || '100%';
                            BgColor = $xml.find('BgColor').text() || 'f1f1f1';
                            BgAlpha = parseInt($xml.find('BgAlpha').text());
                            ImagesOrder = $xml.find('ImagesOrder').text() || 'normal';
                            ResponsiveEnabled = $xml.find('ResponsiveEnabled').text() || 'true';
                            
                            ThumbnailsPosition = $xml.find('ThumbnailsPosition').text() || 'bottom';
                            ThumbnailsOverImage = $xml.find('ThumbnailsOverImage').text() || 'false';
                            ThumbnailsBgColor = $xml.find('ThumbnailsBgColor').text() || 'f1f1f1';
                            ThumbnailsBgAlpha = parseInt($xml.find('ThumbnailsBgAlpha').text());
                            ThumbnailsSpacing = parseInt($xml.find('ThumbnailsSpacing').text());
                            ThumbnailsPaddingTop = parseInt($xml.find('ThumbnailsPaddingTop').text());
                            ThumbnailsPaddingRight = parseInt($xml.find('ThumbnailsPaddingRight').text());
                            ThumbnailsPaddingBottom = parseInt($xml.find('ThumbnailsPaddingBottom').text());
                            ThumbnailsPaddingLeft = parseInt($xml.find('ThumbnailsPaddingLeft').text());
                                                                
                            ThumbnailsNavigation = $xml.find('ThumbnailsNavigation').text() || 'mouse';
                            ThumbnailsNavigationPrev = $xml.find('ThumbnailsNavigationPrev').text() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrev.png';
                            ThumbnailsNavigationPrevHover = $xml.find('ThumbnailsNavigationPrevHover').text() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrevHover.png';
                            ThumbnailsNavigationNext = $xml.find('ThumbnailsNavigationNext').text() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNext.png';
                            ThumbnailsNavigationNextHover = $xml.find('ThumbnailsNavigationNextHover').text() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNextHover.png';
                            
                            ThumbnailLoader = $xml.find('ThumbnailLoader').text() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailLoader.gif';
                            ThumbnailWidth = parseInt($xml.find('ThumbnailWidth').text());
                            ThumbnailHeight = parseInt($xml.find('ThumbnailHeight').text());
                            ThumbnailWidthDesktop = parseInt($xml.find('ThumbnailWidth').text());
                            ThumbnailHeightDesktop = parseInt($xml.find('ThumbnailHeight').text());
                            ThumbnailWidthMobile = parseInt($xml.find('ThumbnailWidthMobile').text());
                            ThumbnailHeightMobile = parseInt($xml.find('ThumbnailHeightMobile').text());
                            ThumbnailAlpha = parseInt($xml.find('ThumbnailAlpha').text());
                            ThumbnailAlphaHover = parseInt($xml.find('ThumbnailAlphaHover').text());
                            ThumbnailAlphaSelected = parseInt($xml.find('ThumbnailAlphaSelected').text());
                            ThumbnailBgColor = $xml.find('ThumbnailBgColor').text() || 'f1f1f1';
                            ThumbnailBgColorHover = $xml.find('ThumbnailBgColorHover').text() || '000000';
                            ThumbnailBgColorSelected = $xml.find('ThumbnailBgColorSelected').text() || '000000';
                            ThumbnailBorderSize = parseInt($xml.find('ThumbnailBorderSize').text());
                            ThumbnailBorderColor = $xml.find('ThumbnailBorderColor').text() || 'f1f1f1';
                            ThumbnailBorderColorHover = $xml.find('ThumbnailBorderColorHover').text() || '000000';
                            ThumbnailBorderColorSelected = $xml.find('ThumbnailBorderColorSelected').text() || '000000';
                            ThumbnailPaddingTop = parseInt($xml.find('ThumbnailPaddingTop').text());
                            ThumbnailPaddingRight = parseInt($xml.find('ThumbnailPaddingRight').text());
                            ThumbnailPaddingBottom = parseInt($xml.find('ThumbnailPaddingBottom').text());
                            ThumbnailPaddingLeft = parseInt($xml.find('ThumbnailPaddingLeft').text());
                                                        
                            ImageLoader = $xml.find('ImageLoader').text() || 'DOPThumbnailGallery/assets/gui/images/ImageLoader.gif';
                            ImageBgColor = $xml.find('ImageBgColor').text() || 'afafaf';
                            ImageBgAlpha = parseInt($xml.find('ImageBgAlpha').text());
                            ImageDisplayType = $xml.find('ImageDisplayType').text() || 'fit';
                            ImageDisplayTime = parseInt($xml.find('ImageDisplayTime').text());
                            ImageMarginTop = parseInt($xml.find('ImageMarginTop').text());
                            ImageMarginRight = parseInt($xml.find('ImageMarginRight').text());
                            ImageMarginBottom = parseInt($xml.find('ImageMarginBottom').text());
                            ImageMarginLeft = parseInt($xml.find('ImageMarginLeft').text());
                            ImagePaddingTop = parseInt($xml.find('ImagePaddingTop').text());
                            ImagePaddingRight = parseInt($xml.find('ImagePaddingRight').text());
                            ImagePaddingBottom = parseInt($xml.find('ImagePaddingBottom').text());
                            ImagePaddingLeft = parseInt($xml.find('ImagePaddingLeft').text());
                            
                            NavigationEnabled = $xml.find('NavigationEnabled').text() || 'true';
                            NavigationOverImage = $xml.find('NavigationOverImage').text() || 'true';
                            NavigationPrev = $xml.find('NavigationPrev').text() || 'DOPThumbnailGallery/assets/gui/images/Prev.png';
                            NavigationPrevHover = $xml.find('NavigationPrevHover').text() || 'DOPThumbnailGallery/assets/gui/images/PrevHover.png';
                            NavigationNext = $xml.find('NavigationNext').text() || 'DOPThumbnailGallery/assets/gui/images/Next.png';
                            NavigationNextHover = $xml.find('NavigationNextHover').text() || 'DOPThumbnailGallery/assets/gui/images/NextHover.png';
                            NavigationLightbox = $xml.find('NavigationLightbox').text() || 'DOPThumbnailGallery/assets/gui/images/Lightbox.png';
                            NavigationLightboxHover = $xml.find('NavigationLightboxHover').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxHover.png';
                            NavigationTouchDeviceSwipeEnabled = $xml.find('NavigationTouchDeviceSwipeEnabled').text() || 'true';
                            
                            CaptionWidth = parseInt($xml.find('CaptionWidth').text());
                            CaptionHeight = parseInt($xml.find('CaptionHeight').text());
                            CaptionTitleColor = $xml.find('CaptionTitleColor').text() || '000000';
                            CaptionTextColor = $xml.find('CaptionTextColor').text() || '000000';
                            CaptionBgColor = $xml.find('CaptionBgColor').text() || 'ffffff';
                            CaptionBgAlpha = parseInt($xml.find('CaptionBgAlpha').text());
                            CaptionPosition = $xml.find('CaptionPosition').text() || 'bottom';
                            CaptionOverImage = $xml.find('CaptionOverImage').text() || 'true';
                            CaptionScrollScrubColor = $xml.find('CaptionScrollScrubColor').text() || '777777';
                            CaptionScrollBgColor = $xml.find('CaptionScrollBgColor').text() || 'e0e0e0';
                            CaptionMarginTop = parseInt($xml.find('CaptionMarginTop').text());
                            CaptionMarginRight = parseInt($xml.find('CaptionMarginRight').text());
                            CaptionMarginBottom = parseInt($xml.find('CaptionMarginBottom').text());
                            CaptionMarginLeft = parseInt($xml.find('CaptionMarginLeft').text());
                            CaptionPaddingTop = parseInt($xml.find('CaptionPaddingTop').text());
                            CaptionPaddingRight = parseInt($xml.find('CaptionPaddingRight').text());
                            CaptionPaddingBottom = parseInt($xml.find('CaptionPaddingBottom').text());
                            CaptionPaddingLeft = parseInt($xml.find('CaptionPaddingLeft').text());
                                                        
                            LightboxEnabled = $xml.find('LightboxEnabled').text() || 'true';
                            LightboxWindowColor = $xml.find('LightboxWindowColor').text() || '000000';
                            LightboxWindowAlpha = parseInt($xml.find('LightboxWindowAlpha').text());
                            LightboxLoader = $xml.find('LightboxLoader').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxLoader.gif';
                            LightboxBgColor = $xml.find('LightboxBgColor').text() || '000000';
                            LightboxBgAlpha = parseInt($xml.find('LightboxBgAlpha').text());
                            LightboxMarginTop = parseInt($xml.find('LightboxMarginTop').text());
                            LightboxMarginRight = parseInt($xml.find('LightboxMarginRight').text());
                            LightboxMarginBottom = parseInt($xml.find('LightboxMarginBottom').text());
                            LightboxMarginLeft = parseInt($xml.find('LightboxMarginLeft').text());
                            LightboxPaddingTop = parseInt($xml.find('LightboxPaddingTop').text());
                            LightboxPaddingRight = parseInt($xml.find('LightboxPaddingRight').text());
                            LightboxPaddingBottom = parseInt($xml.find('LightboxPaddingBottom').text());
                            LightboxPaddingLeft = parseInt($xml.find('LightboxPaddingLeft').text());
                                                        
                            LightboxNavigationPrev = $xml.find('LightboxNavigationPrev').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxPrev.png';
                            LightboxNavigationPrevHover = $xml.find('LightboxNavigationPrevHover').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxPrevHover.png';
                            LightboxNavigationNext = $xml.find('LightboxNavigationNext').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxNext.png';
                            LightboxNavigationNextHover = $xml.find('LightboxNavigationNextHover').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxNextHover.png';
                            LightboxNavigationClose = $xml.find('LightboxNavigationClose').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxClose.png';
                            LightboxNavigationCloseHover = $xml.find('LightboxNavigationCloseHover').text() || 'DOPThumbnailGallery/assets/gui/images/LightboxCloseHover.png';
                            LightboxNavigationInfoBgColor = $xml.find('LightboxNavigationInfoBgColor').text() || '000000';
                            LightboxNavigationInfoTextColor = $xml.find('LightboxNavigationInfoTextColor').text() || 'dddddd';
                            LightboxNavigationTouchDeviceSwipeEnabled = $xml.find('LightboxNavigationTouchDeviceSwipeEnabled').text() || 'true';
                                                        
                            SocialShareEnabled = $xml.find('SocialShareEnabled').text() || 'true';
                            SocialShare = $xml.find('SocialShare').text() || 'DOPThumbnailGallery/assets/gui/images/SocialShare.png',
                            SocialShareLightbox = $xml.find('SocialShareLightbox').text() || 'DOPThumbnailGallery/assets/gui/images/SocialShareLightbox.png',
                                                                                    
                            TooltipEnabled = $xml.find('TooltipEnabled').text() || 'false';
                            TooltipBgColor = $xml.find('TooltipBgColor').text() || 'ffffff';
                            TooltipStrokeColor = $xml.find('TooltipStrokeColor').text() || '000000';
                            TooltipTextColor = $xml.find('TooltipTextColor').text() || '000000';
                            
                            Slideshow = $xml.find('Slideshow').text() || 'false';
                            SlideshowTime = parseInt($xml.find('SlideshowTime').text());
                            SlideshowAutostart = $xml.find('SlideshowAutostart').text() || 'true';
                            SlideshowLoop = $xml.find('SlideshowLoop').text() || 'true';
                            SlideshowPlay = $xml.find('SlideshowPlay').text() || 'DOPThumbnailGallery/assets/gui/images/Play.png';
                            SlideshowPlayHover = $xml.find('SlideshowPlayHover').text() || 'DOPThumbnailGallery/assets/gui/images/PlayHover.png';
                            SlideshowPause = $xml.find('SlideshowPause').text() || 'DOPThumbnailGallery/assets/gui/images/Pause.png';
                            SlideshowPauseHover = $xml.find('SlideshowPauseHover').text() || 'DOPThumbnailGallery/assets/gui/images/PauseHover.png';
                            
                            AutoHide = $xml.find('AutoHide').text() || 'false';
                            AutoHideTime = parseInt($xml.find('AutoHideTime').text());
                            
                            if (SlideshowAutostart == 'true'){
                                SlideshowStatus = 'play';                                
                            }
                            else{
                                SlideshowStatus = 'pause';
                            }
                            
                            if (Data['ContentDataType'] == 'XML'){
                                methods.parseXMLContent();
                            }
                            else if (Data['ContentDataType'] == 'JSON'){
                                methods.parseJSONContent();                                
                            }
                            else{
                                methods.parseHTMLContent();
                            }
                        }});
                    },
                    parseHTMLSettings:function(){// Parse Settings.     
                        Width = $('.Settings li.Width', Container).html() || '100%';
                        Height = $('.Settings li.Height', Container).html() || '100%';
                        BgColor = $('.Settings li.BgColor', Container).html() || 'f1f1f1';
                        BgAlpha = parseInt($('.Settings li.BgAlpha', Container).html());
                        ImagesOrder = $('.Settings li.ImagesOrder', Container).html() || 'normal';
                        ResponsiveEnabled = $('.Settings li.ResponsiveEnabled').html() || 'true';

                        ThumbnailsPosition = $('.Settings li.ThumbnailsPosition', Container).html() || 'bottom';
                        ThumbnailsOverImage = $('.Settings li.ThumbnailsOverImage', Container).html() || 'false';
                        ThumbnailsBgColor = $('.Settings li.ThumbnailsBgColor', Container).html() || 'f1f1f1';
                        ThumbnailsBgAlpha = parseInt($('.Settings li.ThumbnailsBgAlpha', Container).html());
                        ThumbnailsSpacing = parseInt($('.Settings li.ThumbnailsSpacing', Container).html());
                        ThumbnailsPaddingTop = parseInt($('.Settings li.ThumbnailsPaddingTop', Container).html());
                        ThumbnailsPaddingRight = parseInt($('.Settings li.ThumbnailsPaddingRight', Container).html());
                        ThumbnailsPaddingBottom = parseInt($('.Settings li.ThumbnailsPaddingBottom', Container).html());
                        ThumbnailsPaddingLeft = parseInt($('.Settings li.ThumbnailsPaddingLeft', Container).html());

                        ThumbnailsNavigation = $('.Settings li.ThumbnailsNavigation', Container).html() || 'mouse';
                        ThumbnailsNavigationPrev = $('.Settings li.ThumbnailsNavigationPrev', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrev.png';
                        ThumbnailsNavigationPrevHover = $('.Settings li.ThumbnailsNavigationPrevHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsPrevHover.png';
                        ThumbnailsNavigationNext = $('.Settings li.ThumbnailsNavigationNext', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNext.png';
                        ThumbnailsNavigationNextHover = $('.Settings li.ThumbnailsNavigationNextHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailsNextHover.png';

                        ThumbnailLoader = $('.Settings li.ThumbnailLoader', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ThumbnailLoader.gif';
                        ThumbnailWidth = parseInt($('.Settings li.ThumbnailWidth', Container).html());
                        ThumbnailHeight = parseInt($('.Settings li.ThumbnailHeight', Container).html());
                        ThumbnailWidthDesktop = parseInt($('.Settings li.ThumbnailWidth', Container).html());
                        ThumbnailHeightDesktop = parseInt($('.Settings li.ThumbnailHeight', Container).html());
                        ThumbnailWidthMobile = parseInt($('.Settings li.ThumbnailWidthMobile', Container).html());
                        ThumbnailHeightMobile = parseInt($('.Settings li.ThumbnailHeightMobile', Container).html());
                        ThumbnailAlpha = parseInt($('.Settings li.ThumbnailAlpha', Container).html());
                        ThumbnailAlphaHover = parseInt($('.Settings li.ThumbnailAlphaHover', Container).html());
                        ThumbnailAlphaSelected = parseInt($('.Settings li.ThumbnailAlphaSelected', Container).html());
                        ThumbnailBgColor = $('.Settings li.ThumbnailBgColor', Container).html() || 'f1f1f1';
                        ThumbnailBgColorHover = $('.Settings li.ThumbnailBgColorHover', Container).html() || '000000';
                        ThumbnailBgColorSelected = $('.Settings li.ThumbnailBgColorSelected', Container).html() || '000000';
                        ThumbnailBorderSize = parseInt($('.Settings li.ThumbnailBorderSize', Container).html());
                        ThumbnailBorderColor = $('.Settings li.ThumbnailBorderColor', Container).html() || 'f1f1f1';
                        ThumbnailBorderColorHover = $('.Settings li.ThumbnailBorderColorHover', Container).html() || '000000';
                        ThumbnailBorderColorSelected = $('.Settings li.ThumbnailBorderColorSelected', Container).html() || '000000';
                        ThumbnailPaddingTop = parseInt($('.Settings li.ThumbnailPaddingTop', Container).html());
                        ThumbnailPaddingRight = parseInt($('.Settings li.ThumbnailPaddingRight', Container).html());
                        ThumbnailPaddingBottom = parseInt($('.Settings li.ThumbnailPaddingBottom', Container).html());
                        ThumbnailPaddingLeft = parseInt($('.Settings li.ThumbnailPaddingLeft', Container).html());

                        ImageLoader = $('.Settings li.ImageLoader', Container).html() || 'DOPThumbnailGallery/assets/gui/images/ImageLoader.gif';
                        ImageBgColor = $('.Settings li.ImageBgColor', Container).html() || 'afafaf';
                        ImageBgAlpha = parseInt($('.Settings li.ImageBgAlpha', Container).html());
                        ImageDisplayType = $('.Settings li.ImageDisplayType', Container).html() || 'fit';
                        ImageDisplayTime = parseInt($('.Settings li.ImageDisplayTime', Container).html());
                        ImageMarginTop = parseInt($('.Settings li.ImageMarginTop', Container).html());
                        ImageMarginRight = parseInt($('.Settings li.ImageMarginRight', Container).html());
                        ImageMarginBottom = parseInt($('.Settings li.ImageMarginBottom', Container).html());
                        ImageMarginLeft = parseInt($('.Settings li.ImageMarginLeft', Container).html());
                        ImagePaddingTop = parseInt($('.Settings li.ImagePaddingTop', Container).html());
                        ImagePaddingRight = parseInt($('.Settings li.ImagePaddingRight', Container).html());
                        ImagePaddingBottom = parseInt($('.Settings li.ImagePaddingBottom', Container).html());
                        ImagePaddingLeft = parseInt($('.Settings li.ImagePaddingLeft', Container).html());

                        NavigationEnabled = $('.Settings li.NavigationEnabled', Container).html() || 'true';
                        NavigationOverImage = $('.Settings li.NavigationOverImage', Container).html() || 'true';
                        NavigationPrev = $('.Settings li.NavigationPrev', Container).html() || 'DOPThumbnailGallery/assets/gui/images/Prev.png';
                        NavigationPrevHover = $('.Settings li.NavigationPrevHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/PrevHover.png';
                        NavigationNext = $('.Settings li.NavigationNext', Container).html() || 'DOPThumbnailGallery/assets/gui/images/Next.png';
                        NavigationNextHover = $('.Settings li.NavigationNextHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/NextHover.png';
                        NavigationLightbox = $('.Settings li.NavigationLightbox', Container).html() || 'DOPThumbnailGallery/assets/gui/images/Lightbox.png';
                        NavigationLightboxHover = $('.Settings li.NavigationLightboxHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxHover.png';
                        NavigationTouchDeviceSwipeEnabled = $('.Settings li.NavigationTouchDeviceSwipeEnabled', Container).html() || 'true';

                        CaptionWidth = parseInt($('.Settings li.CaptionWidth', Container).html());
                        CaptionHeight = parseInt($('.Settings li.CaptionHeight', Container).html());
                        CaptionTitleColor = $('.Settings li.CaptionTitleColor', Container).html() || '000000';
                        CaptionTextColor = $('.Settings li.CaptionTextColor', Container).html() || '000000';
                        CaptionBgColor = $('.Settings li.CaptionBgColor', Container).html() || 'ffffff';
                        CaptionBgAlpha = parseInt($('.Settings li.CaptionBgAlpha', Container).html());
                        CaptionPosition = $('.Settings li.CaptionPosition', Container).html() || 'bottom';
                        CaptionOverImage = $('.Settings li.CaptionOverImage', Container).html() || 'true';
                        CaptionScrollScrubColor = $('.Settings li.CaptionScrollScrubColor', Container).html() || '777777';
                        CaptionScrollBgColor = $('.Settings li.CaptionScrollBgColor', Container).html() || 'e0e0e0';
                        CaptionMarginTop = parseInt($('.Settings li.CaptionMarginTop', Container).html());
                        CaptionMarginRight = parseInt($('.Settings li.CaptionMarginRight', Container).html());
                        CaptionMarginBottom = parseInt($('.Settings li.CaptionMarginBottom', Container).html());
                        CaptionMarginLeft = parseInt($('.Settings li.CaptionMarginLeft', Container).html());
                        CaptionPaddingTop = parseInt($('.Settings li.CaptionPaddingTop', Container).html());
                        CaptionPaddingRight = parseInt($('.Settings li.CaptionPaddingRight', Container).html());
                        CaptionPaddingBottom = parseInt($('.Settings li.CaptionPaddingBottom', Container).html());
                        CaptionPaddingLeft = parseInt($('.Settings li.CaptionPaddingLeft', Container).html());

                        LightboxEnabled = $('.Settings li.LightboxEnabled', Container).html() || 'true';
                        LightboxWindowColor = $('.Settings li.LightboxWindowColor', Container).html() || '000000';
                        LightboxWindowAlpha = parseInt($('.Settings li.LightboxWindowAlpha', Container).html());
                        LightboxLoader = $('.Settings li.LightboxLoader', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxLoader.gif';
                        LightboxBgColor = $('.Settings li.LightboxBgColor', Container).html() || '000000';
                        LightboxBgAlpha = parseInt($('.Settings li.LightboxBgAlpha', Container).html());
                        LightboxMarginTop = parseInt($('.Settings li.LightboxMarginTop', Container).html());
                        LightboxMarginRight = parseInt($('.Settings li.LightboxMarginRight', Container).html());
                        LightboxMarginBottom = parseInt($('.Settings li.LightboxMarginBottom', Container).html());
                        LightboxMarginLeft = parseInt($('.Settings li.LightboxMarginLeft', Container).html());
                        LightboxPaddingTop = parseInt($('.Settings li.LightboxPaddingTop', Container).html());
                        LightboxPaddingRight = parseInt($('.Settings li.LightboxPaddingRight', Container).html());
                        LightboxPaddingBottom = parseInt($('.Settings li.LightboxPaddingBottom', Container).html());
                        LightboxPaddingLeft = parseInt($('.Settings li.LightboxPaddingLeft', Container).html());

                        LightboxNavigationPrev = $('.Settings li.LightboxNavigationPrev', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxPrev.png';
                        LightboxNavigationPrevHover = $('.Settings li.LightboxNavigationPrevHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxPrevHover.png';
                        LightboxNavigationNext = $('.Settings li.LightboxNavigationNext', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxNext.png';
                        LightboxNavigationNextHover = $('.Settings li.LightboxNavigationNextHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxNextHover.png';
                        LightboxNavigationClose = $('.Settings li.LightboxNavigationClose', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxClose.png';
                        LightboxNavigationCloseHover = $('.Settings li.LightboxNavigationCloseHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/LightboxCloseHover.png';
                        LightboxNavigationInfoBgColor = $('.Settings li.LightboxNavigationInfoBgColor', Container).html() || '000000';
                        LightboxNavigationInfoTextColor = $('.Settings li.LightboxNavigationInfoTextColor', Container).html() || 'dddddd';
                        LightboxNavigationTouchDeviceSwipeEnabled = $('.Settings li.LightboxNavigationTouchDeviceSwipeEnabled', Container).html() || 'true';
                                                        
                        SocialShareEnabled = $('.Settings li.SocialShareEnabled', Container).html() || 'true';
                        SocialShare = $('.Settings li.SocialShare', Container).html() || 'DOPThumbnailGallery/assets/gui/images/SocialShare.png',
                        SocialShareLightbox = $('.Settings li.SocialShareLightbox', Container).html() || 'DOPThumbnailGallery/assets/gui/images/SocialShareLightbox.png',

                        TooltipEnabled = $('.Settings li.TooltipEnabled', Container).html() || 'false';
                        TooltipBgColor = $('.Settings li.TooltipBgColor', Container).html() || 'ffffff';
                        TooltipStrokeColor = $('.Settings li.TooltipStrokeColor', Container).html() || '000000';
                        TooltipTextColor = $('.Settings li.TooltipTextColor', Container).html() || '000000';

                        Slideshow = $('.Settings li.Slideshow', Container).html() || 'false';
                        SlideshowTime = parseInt($('.Settings li.SlideshowTime', Container).html());
                        SlideshowAutostart = $('.Settings li.SlideshowAutostart', Container).html() || 'true';
                        SlideshowLoop = $('.Settings li.SlideshowLoop', Container).html() || 'true';
                        SlideshowPlay = $('.Settings li.SlideshowPlay', Container).html() || 'DOPThumbnailGallery/assets/gui/images/Play.png';
                        SlideshowPlayHover = $('.Settings li.SlideshowPlayHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/PlayHover.png';
                        SlideshowPause = $('.Settings li.SlideshowPause', Container).html() || 'DOPThumbnailGallery/assets/gui/images/Pause.png';
                        SlideshowPauseHover = $('.Settings li.SlideshowPauseHover', Container).html() || 'DOPThumbnailGallery/assets/gui/images/PauseHover.png';

                        AutoHide = $('.Settings li.AutoHide', Container).html() || 'false';
                        AutoHideTime = parseInt($('.Settings li.AutoHideTime', Container).html());

                        if (SlideshowAutostart == 'true'){
                            SlideshowStatus = 'play';                                
                        }
                        else{
                            SlideshowStatus = 'pause';
                        }
                            
                        if (Data['ContentDataType'] == 'XML'){
                            methods.parseXMLContent();
                        }
                        else if (Data['ContentDataType'] == 'JSON'){
                            methods.parseJSONContent();                                
                        }
                        else{
                            methods.parseHTMLContent();
                        }
                    },
                    parseJSONContent:function(){// Parse Content.
                        $.getJSON(prototypes.acaoBuster(Data['ContentFilePath']), {}, function(data){
                            $.each(data, function(index){
                                $.each(data[index], function(key){
                                    switch (key){
                                        case 'Image':
                                            Images.push(prototypes.acaoBuster(data[index][key])); break;
                                        case 'Thumb':
                                            Thumbs.push(prototypes.acaoBuster(data[index][key])); break;
                                        case 'CaptionTitle':
                                            CaptionTitle.push(data[index][key]);break;
                                        case 'CaptionText':
                                            CaptionText.push(data[index][key]);break;
                                        case 'Media':
                                            Media.push(data[index][key]);break;
                                        case 'LightboxMedia':
                                            LightboxMedia.push(data[index][key]);break;
                                    }
                                });
                            });

                            noImages = Images.length;
                            
                            if (ImagesOrder == 'random'){
                                methods.randomizeImages();
                            }
                        
                            initialWidth = Width;
                            initialHeight = Height;

                            if (ResponsiveEnabled == 'true' && Width != '100%' && Height != '100%'){  
                                methods.rpResponsive();   
                            }
                            
                            if (Width == '100%' && Height == '100%'){
                                if ($(window).width() <= 640){
                                    ThumbnailWidth = ThumbnailWidthMobile;
                                    ThumbnailHeight = ThumbnailHeightMobile;
                                }
                                else{
                                    ThumbnailWidth = ThumbnailWidthDesktop;
                                    ThumbnailHeight = ThumbnailHeightDesktop;
                                }
                            }
                            
                            methods.initGallery();
                        });
                    },  
                    parseXMLContent:function(){// Parse the Content XML.
                        $.ajax({type:"GET", url:prototypes.acaoBuster(Data['ContentFilePath']), dataType:"xml", success:function(xml){   
                            $(xml).find('Image').each(function(){
                                Images.push(prototypes.acaoBuster($(this).text()));
                            });
                            $(xml).find('Thumb').each(function(){
                                Thumbs.push(prototypes.acaoBuster($(this).text()));
                            });   
                            $(xml).find('CaptionTitle').each(function(){
                                CaptionTitle.push($(this).text());
                            });   
                            $(xml).find('CaptionText').each(function(){
                                CaptionText.push($(this).text());
                            });   
                            $(xml).find('Media').each(function(){
                                Media.push($(this).text());
                            });   
                            $(xml).find('LightboxMedia').each(function(){
                                LightboxMedia.push($(this).text());
                            });
                            
                            noImages = Images.length;
                            
                            if (ImagesOrder == 'random'){
                                methods.randomizeImages();
                            }
                        
                            initialWidth = Width;
                            initialHeight = Height;

                            if (ResponsiveEnabled == 'true' && Width != '100%' && Height != '100%'){  
                                methods.rpResponsive();   
                            }
                            
                            if (Width == '100%' && Height == '100%'){
                                if ($(window).width() <= 640){
                                    ThumbnailWidth = ThumbnailWidthMobile;
                                    ThumbnailHeight = ThumbnailHeightMobile;
                                }
                                else{
                                    ThumbnailWidth = ThumbnailWidthDesktop;
                                    ThumbnailHeight = ThumbnailHeightDesktop;
                                }
                            }
                            
                            methods.initGallery();
                        }});
                    }, 
                    parseHTMLContent:function(){// Parse Content.
                        $('.Content li', Container).each(function(){
                            Images.push(prototypes.acaoBuster($('.Image', this).attr('src')));
                            Thumbs.push(prototypes.acaoBuster($('.Thumb', this).attr('src')));
                            CaptionTitle.push($('.CaptionTitle', this).html());
                            CaptionText.push($('.CaptionText', this).html());
                            Media.push($('.Media', this).html());
                            LightboxMedia.push($('.LightboxMedia', this).html());
                        });

                        noImages = Images.length;

                        if (ImagesOrder == 'random'){
                            methods.randomizeImages();
                        }
                        
                        initialWidth = Width;
                        initialHeight = Height;

                        if (ResponsiveEnabled == 'true' && Width != '100%' && Height != '100%'){  
                            methods.rpResponsive();   
                        }
                            
                        if (Width == '100%' && Height == '100%'){
                            if ($(window).width() <= 640){
                                ThumbnailWidth = ThumbnailWidthMobile;
                                ThumbnailHeight = ThumbnailHeightMobile;
                            }
                            else{
                                ThumbnailWidth = ThumbnailWidthDesktop;
                                ThumbnailHeight = ThumbnailHeightDesktop;
                            }
                        }

                        methods.initGallery();
                    },                  
                    
                    randomizeImages:function(){
                        var indexes = new Array(), i,
                        auxImages = new Array(),
                        auxThumbs = new Array(),
                        auxCaptionTitle = new Array(),
                        auxCaptionText = new Array(),
                        auxMedia = new Array(),
                        auxLightboxMedia = new Array();
                        
                        for (i=0; i<noImages; i++){
                            indexes[i] = i;
                            auxImages[i] = Images[i];
                            auxThumbs[i] = Thumbs[i];
                            auxCaptionTitle[i] = CaptionTitle[i];
                            auxCaptionText[i] = CaptionText[i];
                            auxMedia[i] = Media[i];
                            auxLightboxMedia[i] = LightboxMedia[i];
                        }
                        
                        indexes =  prototypes.randomize(indexes);
                        
                        for (i=0; i<noImages; i++){
                            Images[i] = auxImages[indexes[i]];
                            Thumbs[i] = auxThumbs[indexes[i]];
                            CaptionTitle[i] = auxCaptionTitle[indexes[i]];
                            CaptionText[i] = auxCaptionText[indexes[i]];
                            Media[i] = auxMedia[indexes[i]];
                            LightboxMedia[i] = auxLightboxMedia[indexes[i]];
                        }
                    },
                    initGallery:function(){// Init the Gallery
                        var HTML = new Array(),
                        LightboxHTML = new Array();

                        HTML.push('<div class="DOP_ThumbnailGallery_Container">');

                        HTML.push('   <div class="DOP_ThumbnailGallery_Background"></div>');

                        HTML.push('   <div class="DOP_ThumbnailGallery_ThumbnailsContainer">');
                        HTML.push('       <div class="DOP_ThumbnailGallery_ThumbnailsBg"></div>');
                        HTML.push('       <div class="DOP_ThumbnailGallery_ThumbnailsWrapper">');
                        HTML.push('           <div class="DOP_ThumbnailGallery_Thumbnails"></div>');
                        HTML.push('       </div>');                     
                        if (ThumbnailsNavigation == 'arrows' && !prototypes.isTouchDevice()){
                            HTML.push('   <div class="DOP_ThumbnailGallery_ThumbnailsNavigationLeft">');
                            HTML.push('       <img src="'+ThumbnailsNavigationPrev+'" class="normal" alt="" />');
                            HTML.push('       <img src="'+ThumbnailsNavigationPrevHover+'" class="hover" alt="" />');  
                            HTML.push('   </div>');
                            HTML.push('   <div class="DOP_ThumbnailGallery_ThumbnailsNavigationRight">');
                            HTML.push('       <img src="'+ThumbnailsNavigationNext+'" class="normal" alt="" />');
                            HTML.push('       <img src="'+ThumbnailsNavigationNextHover+'" class="hover" alt="" />');  
                            HTML.push('   </div>');
                        }
                        HTML.push('   </div>');

                        HTML.push('   <div class="DOP_ThumbnailGallery_ImageWrapper">');
                        HTML.push('       <div class="DOP_ThumbnailGallery_ImageBg"></div>');
                        HTML.push('       <div class="DOP_ThumbnailGallery_Image"></div>');
                        HTML.push('       <div class="DOP_ThumbnailGallery_Caption">');
                        HTML.push('           <div class="DOP_ThumbnailGallery_CaptionBg"></div>');
                        HTML.push('           <div class="DOP_ThumbnailGallery_CaptionTextWrapper">');
                        HTML.push('               <div class="DOP_ThumbnailGallery_CaptionTitle"></div>');
                        HTML.push('               <div class="DOP_ThumbnailGallery_CaptionTextContainer">');
                        HTML.push('                   <div class="DOP_ThumbnailGallery_CaptionText"></div>');
                        HTML.push('               </div>');
                        HTML.push('           </div>');
                        HTML.push('       </div>');
                        HTML.push('   </div>');

                        if (NavigationEnabled == 'true'){
                            HTML.push('    <div class="DOP_ThumbnailGallery_NavigationButtons">');
                            HTML.push('        <div class="DOP_ThumbnailGallery_NavigationLeft">');
                            HTML.push('            <img src="'+NavigationPrev+'" class="normal" alt="" />');
                            HTML.push('            <img src="'+NavigationPrevHover+'" class="hover" alt="" />');  
                            HTML.push('        </div>');
                            HTML.push('        <div class="DOP_ThumbnailGallery_NavigationRight">');
                            HTML.push('            <img src="'+NavigationNext+'" class="normal" alt="" />');
                            HTML.push('            <img src="'+NavigationNextHover+'" class="hover" alt="" />');  
                            HTML.push('        </div>');
                            HTML.push('        <br class="DOP_ThumbnailGallery_Clear" />');
                            HTML.push('   </div>');
                            HTML.push('   <div class="DOP_ThumbnailGallery_NavigationExtraButtons">');
                            if (LightboxEnabled == 'true'){
                                HTML.push('        <div class="DOP_ThumbnailGallery_NavigationLightbox">');
                                HTML.push('            <img src="'+NavigationLightbox+'" class="normal" alt="" />');
                                HTML.push('            <img src="'+NavigationLightboxHover+'" class="hover" alt="" />');  
                                HTML.push('        </div>');
                            }
                            if (Slideshow == 'true'){
                                HTML.push('        <div class="DOP_ThumbnailGallery_NavigationPlay">');
                                HTML.push('            <img src="'+SlideshowPlay+'" class="normal" alt="" />');
                                HTML.push('            <img src="'+SlideshowPlayHover+'" class="hover" alt="" />');  
                                HTML.push('        </div>');
                                HTML.push('        <div class="DOP_ThumbnailGallery_NavigationPause">');
                                HTML.push('            <img src="'+SlideshowPause+'" class="normal" alt="" />');
                                HTML.push('            <img src="'+SlideshowPauseHover+'" class="hover" alt="" />');  
                                HTML.push('        </div>');
                            }
                            if (SocialShareEnabled == 'true'){
                                HTML.push('        <div class="DOP_ThumbnailGallery_SocialShare"></div>');
                            } 
                            HTML.push('        <br class="DOP_ThumbnailGallery_Clear" />');
                            HTML.push('    </div>');
                        }
                        
                        if (LightboxEnabled == 'true'){
                            LightboxHTML.push('    <div class="DOP_ThumbnailGallery_LightboxWrapper" id="DOP_ThumbnailGallery_LightboxWrapper_'+ID+'">');
                            LightboxHTML.push('        <div class="DOP_ThumbnailGallery_LightboxWindow"></div>');
                            LightboxHTML.push('        <div class="DOP_ThumbnailGallery_LightboxLoader"><img src="'+LightboxLoader+'" alt="" /></div>');
                            LightboxHTML.push('        <div class="DOP_ThumbnailGallery_LightboxContainer">');
                            LightboxHTML.push('            <div class="DOP_ThumbnailGallery_LightboxBg"></div>');
                            LightboxHTML.push('            <div class="DOP_ThumbnailGallery_Lightbox"></div>');
                            LightboxHTML.push('            <div class="DOP_ThumbnailGallery_LightboxNavigation">');
                            LightboxHTML.push('                <div class="DOP_ThumbnailGallery_LightboxNavigationExtraButtons">');
                            LightboxHTML.push('                    <div class="DOP_ThumbnailGallery_LightboxNavigation_CloseBtn">');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationClose+'" class="normal" alt="" />');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationCloseHover+'" class="hover" alt="" />');   
                            LightboxHTML.push('                    </div>');
                            if (SocialShareEnabled == 'true'){
                                LightboxHTML.push('                    <div class="DOP_ThumbnailGallery_LightboxSocialShare"></div>');
                            } 
                            LightboxHTML.push('                    <br class="DOP_ThumbnailGallery_Clear" />'); 
                            LightboxHTML.push('                </div>'); 
                            LightboxHTML.push('                <div class="DOP_ThumbnailGallery_LightboxNavigationButtons">');
                            LightboxHTML.push('                    <div class="DOP_ThumbnailGallery_LightboxNavigation_PrevBtn">');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationPrev+'" class="normal" alt="" />');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationPrevHover+'" class="hover" alt="" />');   
                            LightboxHTML.push('                    </div>');   
                            LightboxHTML.push('                    <div class="DOP_ThumbnailGallery_LightboxNavigation_NextBtn">');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationNext+'" class="normal" alt="" />');
                            LightboxHTML.push('                        <img src="'+LightboxNavigationNextHover+'" class="hover" alt="" />');    
                            LightboxHTML.push('                    </div>');    
                            LightboxHTML.push('                    <br class="DOP_ThumbnailGallery_Clear" />'); 
                            LightboxHTML.push('                </div>');     
                            LightboxHTML.push('                <div class="DOP_ThumbnailGallery_LightboxNavigation_Info">');
                            LightboxHTML.push('                    <span class="current"></span> / '+noImages);
                            LightboxHTML.push('                </div>');                                   
                            LightboxHTML.push('            </div>');
                            LightboxHTML.push('        </div>');
                            LightboxHTML.push('    </div>');
                        }
                        
                        if (TooltipEnabled == 'true'){
                            HTML.push('   <div class="DOP_ThumbnailGallery_Tooltip"></div>');
                        }

                        HTML.push('</div>');

                        Container.html(HTML.join(''));
                        if (LightboxEnabled == 'true'){
                            $('body').append(LightboxHTML.join(''));
                        }
                        methods.initSettings();
                    },
                    initSettings:function(){// Init Settings
                        methods.initContainer();
                        methods.initBackground();
                        
                        if (Images.length > 0){
                            methods.initThumbnails();
                            methods.initImage();
                            
                            if (NavigationEnabled == 'true'){
                                methods.initNavigation();
                            }
                            
                            if (LightboxEnabled == 'true'){
                                methods.initLightbox();
                            }
                            
                            if (TooltipEnabled == 'true' && !prototypes.isTouchDevice()){
                                methods.initTooltip();
                            }
                            
                            methods.initCaption();
                            
                            if (AutoHide == 'true' && !prototypes.isTouchDevice()){
                                methods.initAutoHide();
                            }
                        
                            if (SocialShareEnabled == 'true'){
                                methods.initSocialShare();
                            }
                        }
                        else{
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('display', 'none');
                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('display', 'none');
                            $('.DOP_ThumbnailGallery_NavigationLeft', Container).css('display', 'none');
                            $('.DOP_ThumbnailGallery_NavigationRight', Container).css('display', 'none');
                            $('.DOP_ThumbnailGallery_NavigationLightbox', Container).css('display', 'none');
                        }
                    },
                    initRP:function(){// Init Resize & Positioning
                        if (ResponsiveEnabled == 'true' && Width != '100%' && Height != '100%'){ 
                            methods.rpResponsive();
                        }
                        
                        if (Width == '100%' && Height == '100%'){
                            if ($(window).width() <= 640){
                                ThumbnailWidth = ThumbnailWidthMobile;
                                ThumbnailHeight = ThumbnailHeightMobile;
                            }
                            else{
                                ThumbnailWidth = ThumbnailWidthDesktop;
                                ThumbnailHeight = ThumbnailHeightDesktop;
                            }
                        }
                        methods.rpContainer();
                        methods.rpBackground();
                        methods.rpThumbnails();
                        
                        if (Media[currentImage-1] == ''){
                            methods.rpImage();
                        }
                        else{
                            methods.rpMedia();
                        }
                        if (NavigationEnabled == 'true'){
                            methods.rpNavigation();
                        }
                        if (LightboxEnabled == 'true'){
                            if (Media[currentImage-1] == '' && LightboxMedia[currentImage-1] == ''){
                                methods.rpLightboxImage();
                            }
                            else{
                                methods.rpLightboxMedia();
                            }
                        }
                    },
                    initRPScroll:function(){// Init Resize & Positioning
                        if (lightboxImageLoaded){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css({'margin-top': ($(window).height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height())/2+$(window).scrollTop(),
                                                                                                                           'margin-left': ($(window).width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width())/2+$(window).scrollLeft()});   
                        }
                    },
                    rpResponsive:function(){                     
                        var hiddenBustedItems = prototypes.doHideBuster($(Container));
                        
                        if ($(Container).width() < initialWidth){
                            Width = $(Container).width();                                
                        }
                        else{
                            Width = initialWidth;
                        }
                                                
                        if ($(window).width() <= 640 && initialWidth > initialHeight){
                            Height = Width;
                        }
                        else{
                            Height = Width*initialHeight/initialWidth;
                        }
                        
                        if ($(window).width() <= 640){
                            ThumbnailWidth = ThumbnailWidthMobile;
                            ThumbnailHeight = ThumbnailHeightMobile;
                        }
                        else{
                            ThumbnailWidth = ThumbnailWidthDesktop;
                            ThumbnailHeight = ThumbnailHeightDesktop;
                        }
                        
                        prototypes.undoHideBuster(hiddenBustedItems);
                    },

                    initContainer:function(){// Init Gallery Container
                        $('.DOP_ThumbnailGallery_Container', Container).css('display', 'block');
                        methods.rpContainer();
                    },
                    rpContainer:function(){// Resize & Position the Container
                        if (Width == '100%'){
                            $('.DOP_ThumbnailGallery_Container', Container).width($(Container).width());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Container', Container).width(parseInt(Width));
                        }

                        if (Height == '100%'){
                            $('.DOP_ThumbnailGallery_Container', Container).height($(Container).height());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Container', Container).height(parseInt(Height));
                        }
                    },

                    initBackground:function(){// Init Background
                        $('.DOP_ThumbnailGallery_Background', Container).css('background-color', '#'+BgColor);
                        $('.DOP_ThumbnailGallery_Background', Container).css('opacity', BgAlpha/100);

                        methods.rpBackground();
                    },
                    rpBackground:function(){// Resize & Position Background
                        if (Width == '100%'){
                            $('.DOP_ThumbnailGallery_Background', Container).width($(Container).width());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Background', Container).width(parseInt(Width));
                        }

                        if (Height == '100%'){
                            $('.DOP_ThumbnailGallery_Background', Container).height($(Container).height());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Background', Container).height(parseInt(Height));
                        }
                    },
                    
                    initThumbnails:function(){// Init Thumbnails
                        $('.DOP_ThumbnailGallery_ThumbnailsBg', Container).css('background-color', '#'+ThumbnailsBgColor);
                        $('.DOP_ThumbnailGallery_ThumbnailsBg', Container).css('opacity', ThumbnailsBgAlpha/100);

                        methods.rpThumbnails();
                        
                        $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css('margin-top', ThumbnailsPaddingTop);
                        $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css('margin-left', ThumbnailsPaddingLeft);
                        
                        if (ThumbnailsNavigation == 'arrows' && !prototypes.isTouchDevice()){
                            $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('margin-top', ThumbnailsPaddingTop);
                            $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('margin-top', ThumbnailsPaddingTop);
                            
                            if (ThumbnailsPosition == 'left' || ThumbnailsPosition == 'right'){
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('margin-left', ThumbnailsPaddingLeft);
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('margin-left', ThumbnailsPaddingLeft);
                            }
                        }
                        
                        if (ThumbnailsPosition == 'top'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-top', 0-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': 0}, 600, function(){
                                thumbsDisplayed = true;
                            });
                        }
                        
                        if (ThumbnailsPosition == 'right'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-left', $('.DOP_ThumbnailGallery_Container', Container).width());
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': $('.DOP_ThumbnailGallery_Container', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()}, 600, function(){
                                thumbsDisplayed = true;
                            });
                        }
                        
                        if (ThumbnailsPosition == 'bottom'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-top', $('.DOP_ThumbnailGallery_Container', Container).height());
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': $('.DOP_ThumbnailGallery_Container', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height()}, 600, function(){
                                thumbsDisplayed = true;
                            });
                        }
                        
                        if (ThumbnailsPosition == 'left'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-left', 0-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': 0}, 600, function(){
                                thumbsDisplayed = true;
                            });
                        }
                        
                        if (ThumbnailsNavigation == 'arrows' && !prototypes.isTouchDevice()){
                            methods.initThumbnailsArrows();
                        }
                        else{
                            methods.moveThumbnails();
                        }
                        methods.loadThumb(1);
                    },
                    loadThumb:function(no){// Load Thumbnail No
                        var img = new Image();
                        
                        methods.initThumb(no);
                        
                        $(img).load(function(){
                            $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no).html(this);
                            
                            var hiddenBustedItems = prototypes.doHideBuster($(Container));
                            ThumbsWidth[no-1] = $(this).width();
                            ThumbsHeight[no-1] = $(this).height();
                            prototypes.undoHideBuster(hiddenBustedItems);
                            
                            $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no+' img').attr('alt', CaptionTitle[no-1]);
                            methods.loadCompleteThumb(no);
                            
                            if (no < noImages){
                                methods.loadThumb(no+1);
                            }
                        }).attr('src', Thumbs[no-1]);
                    },
                    initThumb:function(no){// Init Thumbnail
                        var ThumbHTML = new Array();
                        
                        currentThumb = no;
                        
                        ThumbHTML.push('<div class="DOP_ThumbnailGallery_ThumbContainer" id="DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no+'">');
                        ThumbHTML.push('   <div class="DOP_ThumbnailGallery_Thumb" id="DOP_ThumbnailGallery_Thumb_'+ID+'_'+no+'"></div>');
                        ThumbHTML.push('</div>');

                        $('.DOP_ThumbnailGallery_Thumbnails', Container).append(ThumbHTML.join(""));
                        methods.rpThumbnails();
                        
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('opacity', ThumbnailAlpha/100);
                        $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).css('margin-top', ThumbnailPaddingTop);
                        $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).css('margin-left', ThumbnailPaddingLeft);
                        $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).css('margin-bottom', ThumbnailPaddingBottom);
                        $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).css('margin-right', ThumbnailPaddingRight);
                        
                        if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('float', 'left');
                        }

                        if (no != '1'){
                            if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                                $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('margin-left', ThumbnailsSpacing);
                            }
                            else{
                                $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('margin-top', ThumbnailsSpacing);
                            }
                        }

                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('background-color', '#'+ThumbnailBgColor);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('border-width', ThumbnailBorderSize);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).css('border-color', '#'+ThumbnailBorderColor);

                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).addClass('DOP_ThumbnailGallery_ThumbLoader');
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no+'.DOP_ThumbnailGallery_ThumbLoader', Container).css('background-image', 'url('+ThumbnailLoader+')');

                        if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                            if ($('.DOP_ThumbnailGallery_Thumbnails', Container).width() <= $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                                prototypes.hCenterItem($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container), $('.DOP_ThumbnailGallery_Thumbnails', Container), $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width());
                            }
                            else if (parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left')) >= 0){
                                $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', 0);
                            }
                        }
                        else{
                            if ($('.DOP_ThumbnailGallery_Thumbnails', Container).height() <= $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                                prototypes.vCenterItem($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container), $('.DOP_ThumbnailGallery_Thumbnails', Container), $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height());
                            }
                            else if (parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top')) >= 0){
                                $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', 0);
                            }
                        }
                    },
                    loadCompleteThumb:function(no){// Thumbnail Load complete event
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no+'.DOP_ThumbnailGallery_ThumbLoader', Container).css('background-image', 'none');
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).removeClass('DOP_ThumbnailGallery_ThumbLoader');
                        $('img', '#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).css('opacity', 0);
                        $('img', '#DOP_ThumbnailGallery_Thumb_'+ID+'_'+no, Container).stop(true, true).animate({'opacity':'1'}, 600);
                        
                        methods.rpThumbnails();
                                                
                        if (!prototypes.isTouchDevice()){
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).hover(function(){
                                if (currentImage != no){
                                    $(this).stop(true, true).animate({'opacity':ThumbnailAlphaHover/100}, 300);
                                    $(this).css('background-color', '#'+ThumbnailBgColorHover);
                                    $(this).css('border-color', '#'+ThumbnailBorderColorHover);
                                }
                                if (TooltipEnabled == 'true'){
                                    methods.showTooltip(no-1);
                                }
                            },
                            function(){
                                if (currentImage != no){
                                    $(this).stop(true, true).animate({'opacity': ThumbnailAlpha/100}, 300);
                                    $(this).css('background-color', '#'+ThumbnailBgColor);
                                    $(this).css('border-color', '#'+ThumbnailBorderColor);
                                }
                                if (TooltipEnabled == 'true'){
                                    $('.DOP_ThumbnailGallery_Tooltip', Container).css('display', 'none');
                                }
                            });
                        }

                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+no, Container).click(function(){                            
                            if (imageLoaded){
                                if (Media[no-1] != ''){
                                    methods.loadMedia(no);
                                }
                                else{
                                    methods.loadImage(no);
                                }
                            }
                        });
                        
                        if (startWith == no && startWith != 1){                            
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).stop(true, true).animate({'opacity':parseInt(ThumbnailAlphaSelected)/100}, 300);
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('background-color', '#'+ThumbnailBgColorSelected);
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('border-color', '#'+ThumbnailBorderColorSelected);
                            startWith = 0;
                            methods.positionThumbnails();
                        }
                        
                        if (startWith == 1){                            
                            startWith = 0;                            
                        }
                    },
                    rpThumbnails:function(){// Resize & Position the Thumbnails
                        var i,
                        thumbnailWidth = ThumbnailWidth+2*ThumbnailBorderSize+ThumbnailPaddingRight+ThumbnailPaddingLeft,
                        thumbnailWidthNB = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft,
                        thumbnailHeightNB = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom,
                        hiddenBustedItems = prototypes.doHideBuster($(Container));
                        
                        for (i=1; i<=currentThumb; i++){
                            if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                                if (i == 1){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).width(thumbnailWidth);
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).width($('.DOP_ThumbnailGallery_Thumbnails', Container).width()+thumbnailWidth+ThumbnailsSpacing);
                                }
                            }
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+i, Container).width(thumbnailWidthNB);
                            $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+i, Container).height(thumbnailHeightNB);
                            prototypes.resizeItem2($('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+i, Container), $('#DOP_ThumbnailGallery_Thumb_'+ID+'_'+i, Container).children(), ThumbnailWidth, ThumbnailHeight, ThumbsWidth[i-1], ThumbsHeight[i-1], 'center');
                        }
                        
                        if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width($('.DOP_ThumbnailGallery_Container', Container).width());
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height(ThumbnailHeight+(2*ThumbnailBorderSize)+ThumbnailPaddingTop+ThumbnailPaddingBottom+ThumbnailsPaddingTop+ThumbnailsPaddingBottom);
                                
                            if (ThumbnailsNavigation == 'arrows' && !prototypes.isTouchDevice()){
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width()-2*ThumbnailsSpacing-ThumbnailsPaddingRight-ThumbnailsPaddingLeft-$('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).width());
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('margin-left', ThumbnailsPaddingLeft);
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('margin-left', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).width()-ThumbnailsPaddingRight);
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'none');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'none');
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css({'margin-left': ThumbnailsPaddingLeft+$('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).width()+ThumbnailsSpacing, 
                                                                                             'margin-right': ThumbnailsPaddingRight+$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).width()+ThumbnailsSpacing});
                            }
                            else{
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width()-ThumbnailsPaddingRight-ThumbnailsPaddingLeft);
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css({'margin-left': ThumbnailsPaddingLeft, 'margin-right': ThumbnailsPaddingRight});
                            }
                            
                            $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height(ThumbnailHeight+(2*ThumbnailBorderSize)+ThumbnailPaddingTop+ThumbnailPaddingBottom);

                            if ($('.DOP_ThumbnailGallery_Thumbnails', Container).width() <= $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                                prototypes.hCenterItem($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container), $('.DOP_ThumbnailGallery_Thumbnails', Container), $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width());
                            }
                            else{   
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'block');
                                                             
                                if (parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left')) >= 0){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', 0);
                                }
                                
                                if ($('.DOP_ThumbnailGallery_Thumbnails', Container).width()+parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left')) < $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()-$('.DOP_ThumbnailGallery_Thumbnails', Container).width());
                                }
                            }
                        }
                        else if (ThumbnailsPosition == 'right' || ThumbnailsPosition == 'left'){                            
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width(ThumbnailWidth+(2*ThumbnailBorderSize)+ThumbnailPaddingRight+ThumbnailPaddingLeft+ThumbnailsPaddingRight+ThumbnailsPaddingLeft);
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height($('.DOP_ThumbnailGallery_Container', Container).height());
                            
                            if (ThumbnailsNavigation == 'arrows' && !prototypes.isTouchDevice()){
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height()-2*ThumbnailsSpacing-ThumbnailsPaddingBottom-ThumbnailsPaddingTop-$('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft').height()-$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight').height());
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('margin-top', ThumbnailsPaddingTop);
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('margin-top', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight').height()-ThumbnailsPaddingBottom);
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'none');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'none');
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css({'margin-top': ThumbnailsPaddingTop+$('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).height()+ThumbnailsSpacing, 
                                                                                             'margin-bottom': ThumbnailsPaddingBottom+$('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).height()+ThumbnailsSpacing});
                            }
                            else{
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height()-ThumbnailsPaddingTop-ThumbnailsPaddingBottom);
                                $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).css({'margin-top': ThumbnailsPaddingTop, 'margin-bottom': ThumbnailsPaddingBottom});
                            }
                            
                            $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width(ThumbnailWidth+(2*ThumbnailBorderSize)+ThumbnailPaddingRight+ThumbnailPaddingLeft);

                            if ($('.DOP_ThumbnailGallery_Thumbnails', Container).height() <= $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                                prototypes.vCenterItem($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container), $('.DOP_ThumbnailGallery_Thumbnails', Container), $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height());
                            }
                            else{
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).css('display', 'block');
                                $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).css('display', 'block');
                                
                                if (parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top')) >= 0){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', 0);
                                }
                                
                                if ($('.DOP_ThumbnailGallery_Thumbnails', Container).height()+parseInt($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top')) < $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()-$('.DOP_ThumbnailGallery_Thumbnails', Container).height());
                                }
                            }
                        }
                        
                        if (thumbsDisplayed){
                            if (ThumbnailsPosition == 'top'){
                                $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-top', 0);
                            }

                            if (ThumbnailsPosition == 'right'){
                                $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-left', $('.DOP_ThumbnailGallery_Container', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            }

                            if (ThumbnailsPosition == 'bottom'){
                                $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-top', $('.DOP_ThumbnailGallery_Container', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            }

                            if (ThumbnailsPosition == 'left'){
                                $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).css('margin-left', 0);
                            }
                        }
                        

                        $('.DOP_ThumbnailGallery_ThumbnailsBg', Container).width($('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                        $('.DOP_ThumbnailGallery_ThumbnailsBg', Container).height($('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                        
                        if (ThumbnailsNavigation == 'arrows' && ($('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).width() < 2 || $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).width() < 2)){
                            setTimeout(function(){
                                methods.rpThumbnails();
                            }, 100);
                        }
                        
                        prototypes.undoHideBuster(hiddenBustedItems);
                    },
                    moveThumbnails:function(){// Move Thumbnails
                        if (prototypes.isTouchDevice()){
                            prototypes.touchNavigation($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container), $('.DOP_ThumbnailGallery_Thumbnails', Container));
                        }
                        else{
                            $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).mousemove(function(e){
                                var thumbnailWidth, thumbnailHeight, mousePosition, thumbnailsPosition;

                                if ((ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom') && $('.DOP_ThumbnailGallery_Thumbnails', Container).width() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                                    thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize;
                                    mousePosition = e.clientX-$(this).offset().left+$(document).scrollLeft();
                                    thumbnailsPosition = 0-(mousePosition-thumbnailWidth-ThumbnailsSpacing)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width())/($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()-2*thumbnailWidth);
                                    
                                    if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width())){
                                        thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width());
                                    }
                                    if (thumbnailsPosition > 0){
                                        thumbnailsPosition = 0;
                                    }
                                    
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', thumbnailsPosition);
                                }

                                if ((ThumbnailsPosition == 'right' || ThumbnailsPosition == 'left') && $('.DOP_ThumbnailGallery_Thumbnails', Container).height() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                                    thumbnailHeight = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+2*ThumbnailBorderSize;
                                    mousePosition = e.clientY-$(this).offset().top+$(document).scrollTop();
                                    thumbnailsPosition = 0-(mousePosition-thumbnailHeight-ThumbnailsSpacing)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height())/($('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()-2*thumbnailHeight);

                                    if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height())){
                                        thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height());
                                    }
                                    if (thumbnailsPosition > 0){
                                        thumbnailsPosition = 0;
                                    }
                                    
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', thumbnailsPosition);
                                }
                            });
                        }
                    },
                    initThumbnailsArrows:function(){
                        if (!prototypes.isTouchDevice()){
                            $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');
                            });
                        
                            $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');
                            });
                        }
                        
                        $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).mousedown(function(){
                            methods.moveThumbnailsLeft();
                        });
                        
                        $('.DOP_ThumbnailGallery_ThumbnailsNavigationLeft', Container).mouseup(function(){
                            clearInterval(MoveThumbnailsLeftID);
                        });

                        $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).mousedown(function(){
                            methods.moveThumbnailsRight();
                        });

                        $('.DOP_ThumbnailGallery_ThumbnailsNavigationRight', Container).mouseup(function(){    
                            clearInterval(MoveThumbnailsRightID);
                        });
                    },
                    positionThumbnails:function(){// Position thumbnails to be displayed when hidden.
                        var thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize,
                        thumbnailHeight = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+2*ThumbnailBorderSize;
                        
                        if (startWith == 0){
                            if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                                if ($('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().left < (-1)*parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left'))){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).stop(true, true).animate({'margin-left': (-1)*$('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().left}, ThumbnailsPositionTime, function(){
                                        if (parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left')) > 0){
                                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', 0);
                                        }
                                    });
                                }
                                else if ($('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().left+thumbnailWidth > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()+(-1)*parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left'))){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).stop(true, true).animate({'margin-left': (-1)*$('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage).position().left+$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()-thumbnailWidth-ThumbnailsSpacing}, ThumbnailsPositionTime, function(){
                                        if (parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left')) < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width())){
                                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()));
                                        }
                                    });                                
                                }
                            }
                            else{
                                if ($('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().top < (-1)*parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top'))){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).stop(true, true).animate({'margin-top': (-1)*$('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().top}, ThumbnailsPositionTime, function(){
                                        if (parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top')) > 0){
                                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', 0);
                                        }
                                    });
                                }
                                else if ($('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).position().top+thumbnailWidth > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()+(-1)*parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top'))){
                                    $('.DOP_ThumbnailGallery_Thumbnails', Container).stop(true, true).animate({'margin-top': (-1)*$('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage).position().top+$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()-thumbnailHeight-ThumbnailsSpacing}, ThumbnailsPositionTime, function(){
                                        if (parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top')) < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height())){
                                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()));
                                        }
                                    });                                
                                }                            
                            }
                        }
                    },
                    moveThumbnailsLeft:function(){      
                        clearInterval(MoveThumbnailsLeftID);                  
                        
                        var thumbnailWidth, thumbnailHeight, thumbnailsPosition;

                        if ((ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom') && $('.DOP_ThumbnailGallery_Thumbnails', Container).width() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                            thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize;
                            thumbnailsPosition =  parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left'))+thumbnailWidth/5;

                            if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width())){
                                thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width());
                            }
                            if (thumbnailsPosition > 0){
                                thumbnailsPosition = 0;
                            }

                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', thumbnailsPosition);
                        }

                        if ((ThumbnailsPosition == 'right' || ThumbnailsPosition == 'left') && $('.DOP_ThumbnailGallery_Thumbnails', Container).height() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                            thumbnailHeight = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+2*ThumbnailBorderSize;
                            thumbnailsPosition =  parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top'))+thumbnailHeight/5;

                            if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height())){
                                thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height());
                            }
                            if (thumbnailsPosition > 0){
                                thumbnailsPosition = 0;
                            }

                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', thumbnailsPosition);
                        }
                        
                        MoveThumbnailsLeftID = setInterval(methods.moveThumbnailsLeft, 100);
                    },
                    moveThumbnailsRight:function(){
                        clearInterval(MoveThumbnailsRightID);
                        
                        var thumbnailWidth, thumbnailHeight, thumbnailsPosition;
                        
                        if ((ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom') && $('.DOP_ThumbnailGallery_Thumbnails', Container).width() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width()){
                            thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize;
                            thumbnailsPosition = parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left'))-thumbnailWidth/5;

                            if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width())){
                                thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).width());
                            }
                            if (thumbnailsPosition > 0){
                                thumbnailsPosition = 0;
                            }

                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-left', thumbnailsPosition);
                        }

                        if ((ThumbnailsPosition == 'right' || ThumbnailsPosition == 'left') && $('.DOP_ThumbnailGallery_Thumbnails', Container).height() > $('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height()){
                            thumbnailHeight = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+2*ThumbnailBorderSize;
                            thumbnailsPosition = parseFloat($('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top'))-thumbnailHeight/5;

                            if (thumbnailsPosition < (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height())){
                                thumbnailsPosition = (-1)*($('.DOP_ThumbnailGallery_Thumbnails', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsWrapper', Container).height());
                            }
                            if (thumbnailsPosition > 0){
                                thumbnailsPosition = 0;
                            }

                            $('.DOP_ThumbnailGallery_Thumbnails', Container).css('margin-top', thumbnailsPosition);
                        }
                        
                        MoveThumbnailsRightID = setInterval(methods.moveThumbnailsRight, 100);
                    },

                    initImage:function(){// Init Image
                        startGalleryID = prototypes.$_GET('dop_thumbnail_gallery_id') != undefined ? parseInt(prototypes.$_GET('dop_thumbnail_gallery_id')):0;
                        startWith = prototypes.$_GET('dop_thumbnail_gallery_share') != undefined && startGalleryID == ID ? parseInt(prototypes.$_GET('dop_thumbnail_gallery_share')):1;
                        startWithLightbox = prototypes.$_GET('dop_thumbnail_gallery_lightbox') != undefined && prototypes.$_GET('dop_thumbnail_gallery_lightbox').indexOf('true') != -1 && startGalleryID == ID ? true:false;
                                                                        
                        if (ImageBgColor != 'css'){
                            $('.DOP_ThumbnailGallery_ImageBg', Container).css('background-color', '#'+ImageBgColor);
                        }
                        $('.DOP_ThumbnailGallery_ImageBg', Container).css('opacity', ImageBgAlpha/100);
                        
                        methods.rpImage();
                                       
                        if (startGalleryID == ID){
                            var href = window.location.href,
                            variables = 'dop_thumbnail_gallery_id='+startGalleryID+'&dop_thumbnail_gallery_share='+startWith+'&dop_thumbnail_gallery_lightbox='+startWithLightbox;

                            if (href.indexOf('?'+variables) != -1){
                                variables = '?'+variables;
                            }
                            else{
                                variables = '&'+variables;
                            }
                                
                            window.location = '#DOPThumbnailGallery'+ID;
                            
                            try{
                                window.history.pushState({'html':'', 'pageTitle':document.title}, '', href.split(variables)[0]);
                            }catch(e){
                                //console.log(e);
                            }
                        }
                                       
                        if (Media[startWith-1] != ''){
                            methods.loadMedia(startWith);
                        }
                        else{
                            methods.loadImage(startWith);
                        }
                        
                        if (startWithLightbox && LightboxEnabled == 'true'){
                            methods.showLightbox();
                        }
                        
                        $(document).keydown(function(e){
                            if (imageLoaded && $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display') != 'block'){
                                switch (e.keyCode){
                                    case 13:
                                        methods.showLightbox();
                                        break;
                                    case 37:
                                        methods.previousImage();
                                        break;
                                    case 39:
                                        methods.nextImage();
                                        break;                                    
                                }
                            }
                        });
                    },
                    loadImage:function(no){// Load Image
                        var img = new Image();
                        
                        clearInterval(SlideshowID);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).stop(true, true).animate({'opacity':parseInt(ThumbnailAlpha)/100}, 300);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('background-color', '#'+ThumbnailBgColor);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('border-color', '#'+ThumbnailBorderColor);
                        currentImage = no;
                        imageLoaded = false;
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).stop(true, true).animate({'opacity':parseInt(ThumbnailAlphaSelected)/100}, 300);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('background-color', '#'+ThumbnailBgColorSelected);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('border-color', '#'+ThumbnailBorderColorSelected);
                        
                        methods.positionThumbnails();                        
                        methods.navigationDisplay('none'); 
                        methods.hideCaption();
                        
                        $('.DOP_ThumbnailGallery_Image', Container).stop(true, true).animate({'opacity':'0'}, parseInt(ImageDisplayTime)/2, function(){
                            $('.DOP_ThumbnailGallery_Image', Container).html('');
                            $('.DOP_ThumbnailGallery_ImageBg', Container).addClass('DOP_ThumbnailGallery_ImageLoader');
                            $('.DOP_ThumbnailGallery_ImageLoader', Container).css('background-image', 'url('+ImageLoader+')');

                            $(img).load(function(){
                                $('.DOP_ThumbnailGallery_CaptionTitle', Container).html(CaptionTitle[no-1]);
                                $('.DOP_ThumbnailGallery_CaptionText', Container).html(CaptionText[no-1]);
                                $('.DOP_ThumbnailGallery_Image', Container).removeClass('DOP_ThumbnailGallery_BigLoader');
                                $('.DOP_ThumbnailGallery_Image', Container).html(this);
                                $('.DOP_ThumbnailGallery_Image img', Container).attr('alt', CaptionTitle[no-1]);
                                
                                if (SocialShareEnabled == 'true' && !lightboxImageLoaded){
                                    methods.showSocialShare(false);
                                }
                                $('.DOP_ThumbnailGallery_ImageLoader', Container).css('background-image', 'none');
                                $('.DOP_ThumbnailGallery_ImageBg', Container).removeClass('DOP_ThumbnailGallery_ImageLoader');
                                
                                var hiddenBustedItems = prototypes.doHideBuster($(Container));
                                ImageWidth = $(this).width();
                                ImageHeight = $(this).height();
                                prototypes.undoHideBuster(hiddenBustedItems);
                                
                                $('.DOP_ThumbnailGallery_Image', Container).css('opacity', 0);

                                if (ImageDisplayType == 'fit'){
                                    var currW = 0, currH = 0, ml = 0, mt = 0, dw = ImageWidth, dh = ImageHeight,
                                    cw = $('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-ImageMarginLeft-ImageMarginRight-ImagePaddingLeft-ImagePaddingRight,
                                    ch = $('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageMarginTop-ImageMarginBottom-ImagePaddingTop-ImagePaddingBottom;

                                    if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                                        ch = ch-CaptionHeight;
                                    }
                            
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

                                    currW = currW+ImagePaddingLeft+ImagePaddingRight;
                                    currH = currH+ImagePaddingTop+ImagePaddingBottom;
                                                                    
                                    if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                                        currH += CaptionHeight;
                                    }

                                    ml = ($('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-currW)/2;
                                    mt = ($('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-currH)/2;

                                    $('.DOP_ThumbnailGallery_ImageBg', Container).stop(true, true).animate({'width':currW, 'height':currH, 'margin-left':ml, 'margin-top':mt}, parseInt(ImageDisplayTime)/2, function(){
                                        methods.rpImage();
                                        $('.DOP_ThumbnailGallery_Image', Container).stop(true, true).animate({'opacity':'1'}, parseInt(ImageDisplayTime)/2, function(){
                                            if (Slideshow == 'true'){
                                                clearInterval(SlideshowID);
                                                
                                                if (((SlideshowLoop == 'true' && currentImage == noImages) || currentImage < noImages) && SlideshowStatus == 'play'){
                                                    SlideshowID = setInterval(methods.nextImage, parseInt(SlideshowTime));
                                                }
                                            }
                                            
                                            imageLoaded = true;
                                            
                                            if (!ItemsHidden){
                                                methods.rpNavigation();
                                            }
                                            
                                            methods.showCaption();
                                        });
                                    });
                                }
                                else{
                                    methods.rpImage();
                                    $('.DOP_ThumbnailGallery_Image', Container).stop(true, true).animate({'opacity':'1'}, parseInt(ImageDisplayTime), function(){
                                        if (Slideshow == 'true'){
                                            clearInterval(SlideshowID);
                                                
                                            if (((SlideshowLoop == 'true' && currentImage == noImages) || currentImage < noImages) && SlideshowStatus == 'play'){
                                                SlideshowID = setInterval(methods.nextImage, parseInt(SlideshowTime));
                                            }
                                        }
                                        
                                        imageLoaded = true;
                                        
                                        if (!ItemsHidden){
                                            methods.rpNavigation();
                                        }
                                        
                                        methods.showCaption();
                                    });
                                }
                            }).attr('src', Images[no-1]);

                        });
                    },
                    rpImage:function(){// Resize & Position Image
                        var hiddenBustedItems = prototypes.doHideBuster($(Container));
                        
                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width());
                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height());
                        
                        if (ThumbnailsOverImage == 'false'){                        
                            if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            }
                            else{
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            }

                            if (ThumbnailsPosition == 'top'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            }
                            if (ThumbnailsPosition == 'left'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            }
                        }

                        if (ImageDisplayType == 'fit'){
                            var currW = 0, currH = 0, ml = 0, mt = 0, dw = ImageWidth, dh = ImageHeight,
                            cw = $('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-ImageMarginLeft-ImageMarginRight-ImagePaddingLeft-ImagePaddingRight,
                            ch = $('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageMarginTop-ImageMarginBottom-ImagePaddingTop-ImagePaddingBottom;

                            if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                                ch = ch-CaptionHeight;
                            }
                            
                            if (ImageWidth == 0 || ImageHeight == 0){
                                dw = 200;
                                dh = 200;
                            }

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

                            $('.DOP_ThumbnailGallery_ImageBg', Container).width(currW+ImagePaddingLeft+ImagePaddingRight);
                            $('.DOP_ThumbnailGallery_ImageBg', Container).height(currH+ImagePaddingTop+ImagePaddingBottom);
                            
                            if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '') && ImageWidth != 0 && ImageHeight != 0){
                                $('.DOP_ThumbnailGallery_ImageBg', Container).height(currH+ImagePaddingTop+ImagePaddingBottom+CaptionHeight);
                            }
                            $('.DOP_ThumbnailGallery_Image', Container).width(currW);
                            $('.DOP_ThumbnailGallery_Image', Container).height(currH);
                            $('.DOP_ThumbnailGallery_Image', Container).children().width(currW);
                            $('.DOP_ThumbnailGallery_Image', Container).children().height(currH);
                            
                            prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_ImageBg', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                            prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Image', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                            
                            if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                                if (CaptionPosition == 'top'){
                                    $('.DOP_ThumbnailGallery_Image', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))-CaptionHeight/2+CaptionHeight);
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_Image', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))-CaptionHeight/2);
                                }
                            }
                        }
                        else{                            
                            $('.DOP_ThumbnailGallery_ImageBg', Container).width($('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-ImageMarginLeft-ImageMarginRight);
                            $('.DOP_ThumbnailGallery_ImageBg', Container).height($('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageMarginTop-ImageMarginBottom);
                            prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_ImageBg', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());                            
                            prototypes.resizeItem2($('.DOP_ThumbnailGallery_Image', Container), $('.DOP_ThumbnailGallery_Image', Container).children(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-ImageMarginLeft-ImageMarginRight, $('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageMarginTop-ImageMarginBottom, ImageWidth, ImageHeight, 'center');
                            prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Image', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                        }

                        methods.rpCaption();
                        
                        if (NavigationEnabled == 'true'){
                            methods.rpNavigation();
                        }
                        
                        prototypes.undoHideBuster(hiddenBustedItems);
                    },

                    loadMedia:function(no){// Load Media                       
                        var iframeSRC = '';
                        
                        clearInterval(SlideshowID);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).stop(true, true).animate({'opacity': ThumbnailAlpha/100}, 300);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('background-color', '#'+ThumbnailBgColor);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('border-color', '#'+ThumbnailBorderColor);
                        currentImage = no;
                        imageLoaded = false;
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).stop(true, true).animate({'opacity':ThumbnailAlphaSelected/100}, 300);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('background-color', '#'+ThumbnailBgColorSelected);
                        $('#DOP_ThumbnailGallery_ThumbContainer_'+ID+'_'+currentImage, Container).css('border-color', '#'+ThumbnailBorderColorSelected);
                        
                        methods.positionThumbnails();
                        methods.navigationDisplay('none'); 
                        methods.hideCaption();

                        $('.DOP_ThumbnailGallery_Image', Container).stop(true, true).animate({'opacity':'0'}, ImageDisplayTime/2, function(){
                            $('.DOP_ThumbnailGallery_Image', Container).html('');
                            $('.DOP_ThumbnailGallery_ImageBg', Container).addClass('DOP_ThumbnailGallery_ImageLoader');
                            $('.DOP_ThumbnailGallery_ImageLoader', Container).css('background-image', 'url('+ImageLoader+')');

                            $('.DOP_ThumbnailGallery_CaptionTitle', Container).html(CaptionTitle[no-1]);
                            $('.DOP_ThumbnailGallery_CaptionText', Container).html(CaptionText[no-1]);
                            $('.DOP_ThumbnailGallery_Image', Container).removeClass('DOP_ThumbnailGallery_BigLoader');
                            
                            $('.DOP_ThumbnailGallery_Image', Container).html(Media[no-1]);
                            
                            if (SocialShareEnabled == 'true' && !lightboxImageLoaded){
                                methods.showSocialShare(false);
                            }
                            
                            var iframeSRC =  $('.DOP_ThumbnailGallery_Image', Container).children().attr('src');
                        
                            if (iframeSRC != null){
                                if (iframeSRC.indexOf('?') != -1){
                                    $('.DOP_ThumbnailGallery_Image', Container).children().attr('src', iframeSRC+'&wmode=transparent');                                
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_Image', Container).children().attr('src', iframeSRC+'?wmode=transparent');
                                }
                            }

                            $('.DOP_ThumbnailGallery_ImageLoader', Container).css('background-image', 'none');
                            $('.DOP_ThumbnailGallery_ImageBg', Container).removeClass('DOP_ThumbnailGallery_ImageLoader');
                            ImageWidth = $('.DOP_ThumbnailGallery_Image', Container).children().width();
                            ImageHeight = $('.DOP_ThumbnailGallery_Image', Container).children().height();
                            $('.DOP_ThumbnailGallery_Image', Container).css('opacity', 0);
                            
                            var ml = ($('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-ImageWidth-ImagePaddingLeft-ImagePaddingRight)/2,
                            mt = ($('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageHeight-ImagePaddingTop-ImagePaddingBottom)/2, ch;
                                                  
                            if (CaptionOverImage == 'false' && (CaptionTitle[no-1] != '' || CaptionText[no-1] != '')){
                                ch = ImageHeight+ImagePaddingTop+ImagePaddingBottom+CaptionHeight;
                                mt = ($('.DOP_ThumbnailGallery_ImageWrapper', Container).height()-ImageHeight-ImagePaddingTop-ImagePaddingBottom-CaptionHeight)/2
                            }
                            else{
                                ch = ImageHeight+ImagePaddingTop+ImagePaddingBottom;
                            }
                            
                            $('.DOP_ThumbnailGallery_ImageBg', Container).stop(true, true).animate({'width':ImageWidth+ImagePaddingLeft+ImagePaddingRight, 'height':ch, 'margin-left':ml, 'margin-top':mt}, ImageDisplayTime/2, function(){
                                methods.rpMedia();
                                $('.DOP_ThumbnailGallery_Image', Container).stop(true, true).animate({'opacity':'1'}, ImageDisplayTime/2, function(){
                                    if (Slideshow == 'true'){
                                        clearInterval(SlideshowID);
                                                
                                        if (((SlideshowLoop == 'true' && currentImage == noImages) || currentImage < noImages) && SlideshowStatus == 'play'){
                                            SlideshowID = setInterval(methods.nextImage, SlideshowTime);
                                        }
                                    }
                                    
                                    imageLoaded = true;
                                    
                                    if (!ItemsHidden){
                                        methods.rpNavigation();
                                    }
                                    
                                    methods.showCaption();
                                });
                            });
                        });
                    },
                    rpMedia:function(){// Resize & Position Media
                        var hiddenBustedItems = prototypes.doHideBuster($(Container));
                        
                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width());
                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height());
                        if (ThumbnailsOverImage == 'false'){
                            if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).height($('.DOP_ThumbnailGallery_Container', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            }
                            else{
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).width($('.DOP_ThumbnailGallery_Container', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            }

                            if (ThumbnailsPosition == 'top'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height());
                            }
                            if (ThumbnailsPosition == 'left'){
                                $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width());
                            }
                        }

                        $('.DOP_ThumbnailGallery_ImageBg', Container).width(ImageWidth+ImagePaddingLeft+ImagePaddingRight);
                        $('.DOP_ThumbnailGallery_ImageBg', Container).height(ImageHeight+ImagePaddingTop+ImagePaddingBottom);
                                                
                        if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                            $('.DOP_ThumbnailGallery_ImageBg', Container).height(ImageHeight+ImagePaddingTop+ImagePaddingBottom+CaptionHeight);
                        }
                        $('.DOP_ThumbnailGallery_Image', Container).width(ImageWidth);
                        $('.DOP_ThumbnailGallery_Image', Container).height(ImageHeight);
                        $('.DOP_ThumbnailGallery_Image', Container).children().width(ImageWidth);
                        $('.DOP_ThumbnailGallery_Image', Container).children().height(ImageHeight);
                        
                        prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_ImageBg', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                        prototypes.centerItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Image', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width(), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                        
                        if (CaptionOverImage == 'false' && (CaptionTitle[currentImage-1] != '' || CaptionText[currentImage-1] != '')){
                            if (CaptionPosition == 'top'){
                                $('.DOP_ThumbnailGallery_Image', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))-CaptionHeight/2+CaptionHeight);
                            }
                            else{
                                $('.DOP_ThumbnailGallery_Image', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))-CaptionHeight/2);
                            }
                        }
                        
                        methods.rpCaption();
                        
                        if (NavigationEnabled == 'true'){
                            methods.rpNavigation();
                        }
                        
                        prototypes.undoHideBuster(hiddenBustedItems);
                    },
                    
                    initNavigation:function(){// Init Navigation   
                        if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){
                            $('.DOP_ThumbnailGallery_NavigationButtons', Container).addClass('outside');
                            $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).addClass('outside');
                        }
                        
                        if (!prototypes.isTouchDevice()){
                            $('.DOP_ThumbnailGallery_NavigationLeft', Container).hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');
                            });
                        
                            $('.DOP_ThumbnailGallery_NavigationRight', Container).hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');
                            });
                        }
                        else{
                            if (NavigationTouchDeviceSwipeEnabled == 'true'){
                                methods.navigationSwipe();
                            }
                        }

                        $('.DOP_ThumbnailGallery_NavigationLeft', Container).click(function(){
                            if (imageLoaded){
                                methods.previousImage();
                            }
                        });

                        $('.DOP_ThumbnailGallery_NavigationRight', Container).click(function(){
                            if (imageLoaded){
                                methods.nextImage();
                            }
                        });
                        
                        if (LightboxEnabled == 'true'){
                            if (!prototypes.isTouchDevice()){
                                $('.DOP_ThumbnailGallery_NavigationLightbox', Container).hover(function(){
                                    $('.normal', this).css('display', 'none');
                                    $('.hover', this).css('display', 'block');
                                }, function(){
                                    $('.normal', this).css('display', 'block');
                                    $('.hover', this).css('display', 'none');
                                });
                            }
                            
                            $('.DOP_ThumbnailGallery_NavigationLightbox', Container).click(function(){
                                methods.showLightbox();
                            });
                        }
                                                
                        if (Slideshow == 'true'){
                            if (!prototypes.isTouchDevice()){
                                $('.DOP_ThumbnailGallery_NavigationPlay', Container).hover(function(){
                                    $('.normal', this).css('display', 'none');
                                    $('.hover', this).css('display', 'block');
                                }, function(){
                                    $('.normal', this).css('display', 'block');
                                    $('.hover', this).css('display', 'none');
                                });
                                
                                $('.DOP_ThumbnailGallery_NavigationPause', Container).hover(function(){
                                    $('.normal', this).css('display', 'none');
                                    $('.hover', this).css('display', 'block');
                                }, function(){
                                    $('.normal', this).css('display', 'block');
                                    $('.hover', this).css('display', 'none');
                                });
                            }
                            
                            $('.DOP_ThumbnailGallery_NavigationPlay', Container).click(function(){
                                SlideshowStatus = 'play';
                                $('.DOP_ThumbnailGallery_NavigationPlay', Container).css('display', 'none');                            
                                $('.DOP_ThumbnailGallery_NavigationPause', Container).css('display', 'block');
                                if (imageLoaded){
                                    methods.nextImage();
                                }
                                methods.rpNavigation();
                            });
                                                        
                            $('.DOP_ThumbnailGallery_NavigationPause', Container).click(function(){
                                SlideshowStatus = 'pause';                        
                                $('.DOP_ThumbnailGallery_NavigationPause', Container).css('display', 'none');
                                $('.DOP_ThumbnailGallery_NavigationPlay', Container).css('display', 'block');    
                                clearInterval(SlideshowID);
                                methods.rpNavigation();
                            });
                        }
                    },
                    previousImage:function(){// Go to previous image
                        if (currentImage == 1){
                            if (Media[noImages-1] != ''){
                                methods.loadMedia(noImages);
                            }
                            else{
                                methods.loadImage(noImages);
                            }
                        }
                        else{
                            if (Media[currentImage-2] != ''){
                                methods.loadMedia(currentImage-1);
                            }
                            else{
                                methods.loadImage(currentImage-1);
                            }
                        }
                    },
                    nextImage:function(){// Go to next image
                        if (imageLoaded){
                            if (currentImage == noImages){
                                if (Media[0] != ''){
                                    methods.loadMedia(1);
                                }
                                else{
                                    methods.loadImage(1);
                                }
                            }
                            else{
                                if (Media[currentImage] != ''){
                                    methods.loadMedia(currentImage+1);
                                }
                                else{
                                    methods.loadImage(currentImage+1);
                                }
                            }
                        }
                    },
                    rpNavigation:function(){// Resize & Position Navigation Buttons    
                        methods.navigationDisplay('block');                         
                        
                        if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){
                            $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().width(),
                                                                                         'margin-top': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+($('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().height())/2,
                                                                                         'width': $('.DOP_ThumbnailGallery_Image', Container).width()+$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().width()*2});
                            $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')),
                                                                                              'margin-top': parseFloat($('.DOP_ThumbnailGallery_ImageBg', Container).css('margin-top'))-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().height()+ImagePaddingTop,
                                                                                              'width': $('.DOP_ThumbnailGallery_NavigationButtons', Container).width()});
                        }
                        else{
                            $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')),
                                                                                         'margin-top': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+($('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().height())/2,
                                                                                         'width': $('.DOP_ThumbnailGallery_Image', Container).width()});
                            $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')),
                                                                                              'margin-top': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+10,
                                                                                              'width': $('.DOP_ThumbnailGallery_NavigationButtons', Container).width()});
                        }
                        
                        if (ThumbnailsPosition == 'left'){
                            if (ThumbnailsOverImage == 'true'){
                                if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'left': $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()+$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().width(),
                                                                                                 'width': $('.DOP_ThumbnailGallery_Image', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))});
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')),
                                                                                                      'width': $('.DOP_ThumbnailGallery_NavigationButtons', Container).width()});
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'left': $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width(),
                                                                                                 'width': $('.DOP_ThumbnailGallery_Image', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))});
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'left': parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')),
                                                                                                      'width': $('.DOP_ThumbnailGallery_NavigationButtons', Container).width()});
                                }
                            }
                            else{
                                if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().width());
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css('left', parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')));
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left', $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')));
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css('left', parseFloat($('.DOP_ThumbnailGallery_NavigationButtons', Container).css('left')));
                                }
                            }
                        }                   
                        
                        if (ThumbnailsPosition == 'top'){
                            if (ThumbnailsOverImage == 'true'){    
                                if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){                      
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()});
                                }
                                else{                      
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).children().height()-10});
                                }
                            }
                            else{
                                if (NavigationOverImage == 'false' && ImageDisplayType == 'fit'){
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+($('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().height())/2});
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))});
                                }
                                else{
                                    $('.DOP_ThumbnailGallery_NavigationButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+($('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_NavigationButtons', Container).children().height())/2});
                                    $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css({'margin-top': parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))+parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+10});
                                }
                            }
                        }
                        
                        if (ThumbnailsPosition == 'right' && ThumbnailsOverImage == 'true'){
                            $('.DOP_ThumbnailGallery_NavigationButtons', Container).width($('.DOP_ThumbnailGallery_ImageWrapper', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()-parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')));
                            $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).width($('.DOP_ThumbnailGallery_NavigationButtons', Container).width());
                        }
                        
                        if (!imageLoaded){    
                            methods.navigationDisplay('none');
                        }                                                       
                    },
                    navigationDisplay:function(value){
                        if (NavigationEnabled == 'true'){  
                            $('.DOP_ThumbnailGallery_NavigationLeft', Container).css('display', value);
                            $('.DOP_ThumbnailGallery_NavigationRight', Container).css('display', value);  
                            $('.DOP_ThumbnailGallery_NavigationExtraButtons', Container).css('display', value);                            
                        }
                        
                        if (Slideshow == 'true'){ 
                            if (SlideshowStatus == 'play'){
                                $('.DOP_ThumbnailGallery_NavigationPlay', Container).css('display', 'none');                            
                                $('.DOP_ThumbnailGallery_NavigationPause', Container).css('display', value);                                    
                            }
                            else{
                                $('.DOP_ThumbnailGallery_NavigationPlay', Container).css('display', value);                            
                                $('.DOP_ThumbnailGallery_NavigationPause', Container).css('display', 'none');                                    
                            }
                        }
                    },
                    navigationSwipe:function(){
                        var prev, curr, touch, initial, positionX, positionY;

                        if (ThumbnailsPosition == 'top' || ThumbnailsPosition == 'bottom'){
                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchstart', function(e){
                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    touch = e.originalEvent.touches[0];
                                    prev = touch.clientX;
                                    initial = parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left')); 
                                }
                            });

                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchmove', function(e){
                                e.preventDefault();

                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    touch = e.originalEvent.touches[0],
                                    curr = touch.clientX,
                                    positionX = curr>prev ? parseInt($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left'))+(curr-prev):parseInt($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left'))-(prev-curr);

                                    methods.navigationDisplay('none'); 
                                    prev = curr;
                                    $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left', positionX);
                                }
                            });

                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchend', function(e){
                                if (!prototypes.isChromeMobileBrowser()){
                                    e.preventDefault();
                                }

                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    
                                    if (parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left'))+parseFloat($('.DOP_ThumbnailGallery_ImageBg', Container).css('margin-left')) < 0){
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css({'margin-left': initial, 'opacity': 0});
                                        $('.DOP_ThumbnailGallery_Image', Container).html('');
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).stop(true, true).animate({'opacity': 1}, ImageDisplayTime/2, function(){
                                            methods.nextImage();
                                        });                                    
                                    }
                                    else if (parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left'))-parseFloat($('.DOP_ThumbnailGallery_ImageBg', Container).css('margin-left'))+$('.DOP_ThumbnailGallery_ImageBg', Container).width() > $('.DOP_ThumbnailGallery_Container', Container).width()){
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css({'margin-left': initial, 'opacity': 0});
                                        $('.DOP_ThumbnailGallery_Image', Container).html('');
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).stop(true, true).animate({'opacity': 1}, ImageDisplayTime/2, function(){
                                            methods.previousImage();
                                        });
                                    }
                                    else{
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-left', initial);
                                        methods.navigationDisplay('block'); 

                                        if (Slideshow == 'true'){
                                            clearInterval(SlideshowID);
                                            
                                            if (((SlideshowLoop == 'true' && currentImage == noImages) || currentImage < noImages) && SlideshowStatus == 'play'){
                                                SlideshowID = setInterval(methods.nextImage, parseInt(SlideshowTime));
                                            }
                                        } 
                                    }
                                }
                            });                        
                        }
                        else{
                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchstart', function(e){
                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    touch = e.originalEvent.touches[0];
                                    prev = touch.clientY;
                                    initial = parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top')); 
                                }
                            });

                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchmove', function(e){
                                e.preventDefault();

                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    touch = e.originalEvent.touches[0],
                                    curr = touch.clientY,
                                    positionY = curr>prev ? parseInt($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))+(curr-prev):parseInt($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))-(prev-curr);

                                    methods.navigationDisplay('none'); 
                                    prev = curr;
                                    $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top', positionY);
                                }
                            });

                            $('.DOP_ThumbnailGallery_ImageWrapper', Container).bind('touchend', function(e){
                                e.preventDefault();

                                if (imageLoaded){
                                    clearInterval(SlideshowID);
                                    
                                    if (parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))+parseFloat($('.DOP_ThumbnailGallery_ImageBg', Container).css('margin-top')) < 0){
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css({'margin-top': initial, 'opacity': 0});
                                        $('.DOP_ThumbnailGallery_Image', Container).html('');
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).stop(true, true).animate({'opacity': 1}, ImageDisplayTime/2, function(){
                                            methods.nextImage();
                                        });                                    
                                    }
                                    else if (parseFloat($('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top'))-parseFloat($('.DOP_ThumbnailGallery_ImageBg', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_ImageBg', Container).height() > $('.DOP_ThumbnailGallery_Container', Container).height()){
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css({'margin-top': initial, 'opacity': 0});
                                        $('.DOP_ThumbnailGallery_Image', Container).html('');
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).stop(true, true).animate({'opacity': 1}, ImageDisplayTime/2, function(){
                                            methods.previousImage();
                                        });
                                    }
                                    else{
                                        $('.DOP_ThumbnailGallery_ImageWrapper', Container).css('margin-top', initial);
                                        methods.navigationDisplay('block'); 

                                        if (Slideshow == 'true'){
                                            clearInterval(SlideshowID);
                                            
                                            if (((SlideshowLoop == 'true' && currentImage == noImages) || currentImage < noImages) && SlideshowStatus == 'play'){
                                                SlideshowID = setInterval(methods.nextImage, parseInt(SlideshowTime));
                                            }
                                        } 
                                    }
                                }
                            });                        
                        }
                    },
                                        
                    initCaption:function(){// Init Caption
                        $('.DOP_ThumbnailGallery_Caption', Container).css('opacity', 0);
                        $('.DOP_ThumbnailGallery_CaptionBg', Container).css('background-color', '#'+CaptionBgColor);
                        $('.DOP_ThumbnailGallery_CaptionBg', Container).css('opacity', CaptionBgAlpha/100);
                        $('.DOP_ThumbnailGallery_CaptionTitle', Container).css('color', '#'+CaptionTitleColor);
                        $('.DOP_ThumbnailGallery_CaptionText', Container).css('color', '#'+CaptionTextColor);
                    },
                    showCaption:function(){// Show Caption
                        if (imageLoaded && ($('.DOP_ThumbnailGallery_CaptionTitle', Container).html() != '' || $('.DOP_ThumbnailGallery_CaptionText', Container).html() != '')){
                            $('.DOP_ThumbnailGallery_Caption', Container).css('display', 'block');
                            $('.DOP_ThumbnailGallery_Caption', Container).stop(true, true).animate({'opacity': 1}, 600, function(){
                                $('.DOP_ThumbnailGallery_CaptionTextContainer', Container).height($('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).height()-$('.DOP_ThumbnailGallery_CaptionTitle', Container).height()-5);
                                $('.DOP_ThumbnailGallery_CaptionTextContainer', Container).jScrollPane();
                                if (CaptionScrollScrubColor != 'css'){
                                    $('.jspDrag', Container).css('background-color', '#'+CaptionScrollScrubColor);
                                }
                                if (CaptionScrollBgColor != 'css'){
                                    $('.jspTrack', Container).css('background-color', '#'+CaptionScrollBgColor);
                                }
                            });
                        }
                    },
                    hideCaption:function(){// Hide Caption
                        $('.DOP_ThumbnailGallery_Caption', Container).stop(true, true).animate({'opacity': 0}, 600, function(){
                            $(this).css('display', 'none');
                        });
                    },
                    rpCaption:function(){// Resize & Position Caption
                        if (CaptionWidth+CaptionMarginLeft+CaptionMarginRight > $('.DOP_ThumbnailGallery_Image', Container).width()){
                            $('.DOP_ThumbnailGallery_Caption', Container).width($('.DOP_ThumbnailGallery_Image', Container).width());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Caption', Container).width(CaptionWidth+CaptionMarginLeft+CaptionMarginRight);
                        }
                        if (CaptionHeight+CaptionMarginTop+CaptionMarginBottom > $('.DOP_ThumbnailGallery_Image', Container).height()){
                            $('.DOP_ThumbnailGallery_Caption', Container).height($('.DOP_ThumbnailGallery_Image', Container).height());
                        }
                        else{
                            $('.DOP_ThumbnailGallery_Caption', Container).height(CaptionHeight+CaptionMarginTop+CaptionMarginBottom);
                        }
                        
                        if (CaptionPosition == 'top'){
                            prototypes.hCenterItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Caption', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width());
                            
                            if (CaptionOverImage == 'false'){
                                $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))-CaptionHeight);
                            }
                            else{
                                $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top')));
                            }
                            
                        }
                        else if (CaptionPosition == 'top-left'){
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top')));
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')));
                        }
                        else if (CaptionPosition == 'top-right'){
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top')));
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))+$('.DOP_ThumbnailGallery_Image', Container).width()-$('.DOP_ThumbnailGallery_Caption', Container).width());
                        }
                        else if (CaptionPosition == 'right'){
                            prototypes.vCenterItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Caption', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))+$('.DOP_ThumbnailGallery_Image', Container).width()-$('.DOP_ThumbnailGallery_Caption', Container).width());
                        }
                        else if (CaptionPosition == 'left'){
                            prototypes.vCenterItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Caption', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).height());
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')));
                        }
                        else if (CaptionPosition == 'bottom-left'){
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_Caption', Container).height());
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left')));
                        }
                        else if (CaptionPosition == 'bottom-right'){
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_Caption', Container).height());
                            $('.DOP_ThumbnailGallery_Caption', Container).css('margin-left', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-left'))+$('.DOP_ThumbnailGallery_Image', Container).width()-$('.DOP_ThumbnailGallery_Caption', Container).width());
                        }
                        else{
                            
                            prototypes.hCenterItem($('.DOP_ThumbnailGallery_ImageWrapper', Container), $('.DOP_ThumbnailGallery_Caption', Container), $('.DOP_ThumbnailGallery_ImageWrapper', Container).width());
                            
                            if (CaptionOverImage == 'false'){
                                $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_Caption', Container).height()+CaptionHeight);
                            }
                            else{
                                $('.DOP_ThumbnailGallery_Caption', Container).css('margin-top', parseFloat($('.DOP_ThumbnailGallery_Image', Container).css('margin-top'))+$('.DOP_ThumbnailGallery_Image', Container).height()-$('.DOP_ThumbnailGallery_Caption', Container).height());
                            }
                        }

                        $('.DOP_ThumbnailGallery_CaptionBg', Container).width($('.DOP_ThumbnailGallery_Caption', Container).width()-CaptionMarginLeft-CaptionMarginRight);
                        $('.DOP_ThumbnailGallery_CaptionBg', Container).height($('.DOP_ThumbnailGallery_Caption', Container).height()-CaptionMarginTop-CaptionMarginBottom);
                        $('.DOP_ThumbnailGallery_CaptionBg', Container).css('margin-top', CaptionMarginTop);
                        $('.DOP_ThumbnailGallery_CaptionBg', Container).css('margin-left', CaptionMarginLeft);

                        $('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).css('margin-top', CaptionMarginTop+CaptionPaddingTop);
                        $('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).css('margin-left', CaptionMarginLeft+CaptionPaddingLeft);
                        $('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).width($('.DOP_ThumbnailGallery_CaptionBg', Container).width()-CaptionPaddingLeft-CaptionPaddingRight);
                        $('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).height($('.DOP_ThumbnailGallery_CaptionBg', Container).height()-CaptionPaddingTop-CaptionPaddingBottom);
                        $('.DOP_ThumbnailGallery_CaptionTextContainer', Container).height($('.DOP_ThumbnailGallery_CaptionTextWrapper', Container).height()-$('.DOP_ThumbnailGallery_CaptionTitle', Container).height()-5);
                        
                        if (prototypes.isTouchDevice()){
                            $('.DOP_ThumbnailGallery_CaptionTextContainer', Container).css('overflow', 'scroll');
                        }
                        else{
                            $('.DOP_ThumbnailGallery_CaptionTextContainer', Container).jScrollPane();
                            if (CaptionScrollScrubColor != 'css'){
                                $('.jspDrag', Container).css('background-color', '#'+CaptionScrollScrubColor);
                            }
                            if (CaptionScrollBgColor != 'css'){
                                $('.jspTrack', Container).css('background-color', '#'+CaptionScrollBgColor);
                            }
                        }
                    },

                    initLightbox:function(){// Init Lightbox
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').css({'background-color': '#'+LightboxWindowColor,
                                                                                                                    'opacity': LightboxWindowAlpha/100});
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxBg').css({'background-color': '#'+LightboxBgColor,
                                                                                                                'opacity': LightboxBgAlpha/100});
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info').css({'background-color': '#'+LightboxNavigationInfoBgColor,
                                                                                                                             'color': '#'+LightboxNavigationInfoTextColor});                                  

                        if (!prototypes.isTouchDevice()){                                                                                                               
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').hover(function(){
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').stop(true, true).animate({'opacity': 1}, LightboxNavigationDisplayTime);
                            }, function(){
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').stop(true, true).animate({'opacity': 0}, LightboxNavigationDisplayTime);
                            });
                            
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_CloseBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').css('opacity', 1);
                            
                            if (LightboxNavigationTouchDeviceSwipeEnabled == 'true'){
                                methods.lightboxNavigationSwipe();
                            }
                        }
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').click(function(){
                            methods.previousLightbox();
                        });
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').click(function(){
                            methods.nextLightbox();
                        });
                                                
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxSocialShare').hover(function(){
                            setTimeout(function(){                                
                                $('#at15s').css('position', 'fixed');
                                
                                $('#at15s').hover(function(){
                                    $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').stop(true, true).animate({'opacity': 1}, 0);  
                                }, function(){
                                    //$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').stop(true, true).animate({'opacity': 0}, LightboxNavigationDisplayTime);
                                });
                            }, 10);
                        }, function(){});
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_CloseBtn').click(function(){
                           methods.hideLightbox();                           
                        });
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').click(function(){
                           methods.hideLightbox();                           
                        });
                        
                        $(document).keydown(function(e){
                            if (lightboxImageLoaded){
                                switch (e.keyCode){
                                    case 27:
                                        methods.hideLightbox();
                                        break;
                                    case 37:
                                        methods.previousLightbox();
                                        break;
                                    case 39:
                                        methods.nextLightbox();
                                        break;                                    
                                }
                            }
                        });
                    },
                    showLightbox:function(){// Show Lightbox                        
                        if (Slideshow == 'true'){
                            SlideshowStatus = 'pause';                        
                            $('.DOP_ThumbnailGallery_NavigationPause', Container).css('display', 'none');
                            $('.DOP_ThumbnailGallery_NavigationPlay', Container).css('display', 'block');    
                            clearInterval(SlideshowID);
                        }
                        methods.rpNavigation();
                        
                        $('#panel').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#content-wrapper').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#footer').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).fadeIn(LightboxDisplayTime, function(){                        
                            if (Media[currentImage-1] != '' || LightboxMedia[currentImage-1] != ''){
                                methods.loadLightboxMedia(currentImage);      
                            }
                            else{
                                methods.loadLightboxImage(currentImage);
                            }
                        }); 
                    },
                    hideLightbox:function(){// Hide Lightbox    
                        if (lightboxImageLoaded){
                            $('#at15s').css('position', 'absolute');

                            $('#panel').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#content-wrapper').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#footer').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).fadeOut(LightboxDisplayTime, function(){
                                lightboxCurrentImage = 0;
                                lightboxImageLoaded = false;
                                clearInterval(socialShareInterval);
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('opacity', 0);
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').html('');
                                methods.showSocialShare(false);
                            });        
                        }
                    },
                    loadLightboxImage:function(no){// Load Lightbox Image
                        var img = new Image(),                      
                        startLightbox = false;
                        lightboxImageLoaded = false;
                        
                        if (lightboxCurrentImage == 0){
                            startLightbox = true;
                        }                        
                            
                        lightboxCurrentImage = no;
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info .current').html(no);
                        
                        if (no == 1){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').css('display', 'none');
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').css('display', 'block');
                        }
                        
                        if (no == noImages){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').css('display', 'none');
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').css('display', 'block');
                        }
                        
                        $(img).load(function(){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'none');
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').html(this);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox img').attr('alt', CaptionTitle[no-1]);
                            
                            if (SocialShareEnabled == 'true'){
                                methods.showSocialShare(true);
                            }
                            lightboxImageWidth = $(this).width();
                            lightboxImageHeight = $(this).height();
                            lightboxImageLoaded = true;
                            methods.rpLightboxImage();
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').stop(true, true).animate({'opacity': 1}, LightboxDisplayTime, function(){
                                if (!startLightbox){
                                    methods.loadImage(no);
                                }
                            });
                        }).attr('src', Images[no-1]);
                    },
                    loadLightboxMedia:function(no){// Load Lightbox Media                          
                        var startLightbox = false;
                        lightboxImageLoaded = false;
                        
                        if (lightboxCurrentImage == 0){
                            startLightbox = true;
                        }
                        
                        clearInterval(SlideshowID);
                        lightboxCurrentImage = no;
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info .current').html(no);
                        
                        if (no == 1){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').css('display', 'none');
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_PrevBtn').css('display', 'block');
                        }
                        
                        if (no == noImages){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').css('display', 'none');
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_NextBtn').css('display', 'block');
                        }
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'none');
                        
                        if (LightboxMedia[no-1] != ''){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').html(LightboxMedia[no-1]);
                        }
                        else{
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').html(Media[no-1]);                            
                        }
                        
                        if (SocialShareEnabled == 'true'){
                            methods.showSocialShare(true);
                        }
                        
                        var iframeSRC =  $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().attr('src');
                        
                        if (iframeSRC != null){
                            if (iframeSRC.indexOf('?') != -1){
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().attr('src', iframeSRC+'&wmode=transparent');                                
                            }
                            else{
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().attr('src', iframeSRC+'?wmode=transparent');
                            }
                        }
                        
                        lightboxImageLoaded = true;
                        methods.rpLightboxMedia();

                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').stop(true, true).animate({'opacity': 1}, LightboxDisplayTime, function(){
                            if (!startLightbox){
                                if (Media[no-1] != ''){
                                    methods.loadMedia(no);
                                }
                                else{
                                    methods.loadImage(no);
                                }
                            }
                        });
                    },
                    previousLightbox:function(){
                        if (lightboxCurrentImage > 1){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').stop(true, true).animate({'opacity': 0}, LightboxDisplayTime, function(){
                                if (Media[lightboxCurrentImage-2] != '' || LightboxMedia[lightboxCurrentImage-2] != ''){
                                    methods.loadLightboxMedia(lightboxCurrentImage-1);
                                }
                                else{
                                    methods.loadLightboxImage(lightboxCurrentImage-1);
                                }
                            });   
                        }
                    },
                    nextLightbox:function(){
                        if (lightboxCurrentImage < noImages){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').stop(true, true).animate({'opacity': 0}, LightboxDisplayTime, function(){
                                if (Media[lightboxCurrentImage] != '' || LightboxMedia[lightboxCurrentImage] != ''){
                                    methods.loadLightboxMedia(lightboxCurrentImage+1);
                                }
                                else{
                                    methods.loadLightboxImage(lightboxCurrentImage+1);
                                }
                            });  
                        }
                    },
                    rpLightboxImage:function(){// Resize & Position Lightbox Image
                        var maxWidth = $(window).width()-($(window).width() <= 640 ? 0:LightboxMarginRight)-($(window).width() <= 640 ? 0:LightboxMarginLeft)-LightboxPaddingRight-LightboxPaddingLeft, 
                        maxHeight = $(window).height()-($(window).width() <= 640 ? 0:LightboxMarginTop)-($(window).width() <= 640 ? 0:LightboxMarginBottom)-LightboxPaddingTop-LightboxPaddingBottom,
                        currW, currH;
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'none');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).width($(document).width());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).height($(document).height());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').width($(document).width());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').height($(document).height());
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css({'top': ($(window).height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').height())/2,
                                                                                                                    'left': ($(window).width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').width())/2});
                        if (lightboxCurrentImage == 0){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'none');                         
                        }
                        
                        if (lightboxCurrentImage == 0 || lightboxImageLoaded){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'none');
                        }
                        
                        if (lightboxImageLoaded){  
                            if (lightboxImageWidth <= maxWidth && lightboxImageHeight <= maxHeight){
                                currW = lightboxImageWidth;
                                currH = lightboxImageHeight;
                            }
                            else{
                                currH = maxHeight;
                                currW = (lightboxImageWidth*maxHeight)/lightboxImageHeight;

                                if (currW > maxWidth){
                                    currW = maxWidth;
                                    currH = (lightboxImageHeight*maxWidth)/lightboxImageWidth;
                                }
                            }
                            
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox img').width(currW);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox img').height(currH);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox img').css({'margin-top': LightboxPaddingTop,
                                                                                                                      'margin-left': LightboxPaddingLeft});
                            
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height(currH+LightboxPaddingTop+LightboxPaddingBottom);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxBg').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxBg').height(currH+LightboxPaddingTop+LightboxPaddingBottom);
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css({'margin-top': ($(window).height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height())/2+$(window).scrollTop(),
                                                                                                                           'margin-left': ($(window).width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width())/2+$(window).scrollLeft()});
                            methods.rpLightboxNavigation();
                        }
                    },
                    rpLightboxMedia:function(){// Resize & Position Lightbox Media
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'none');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').css({'height': $(document).height(),
                                                                                                              'width': $(document).width()});
                                                                                                          
                        var currW = $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().width(),
                        currH = $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().height();
                                                
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).width($(document).width());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).height($(document).height());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').width($(document).width());
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxWindow').height($(document).height());
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css({'top': ($(window).height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').height())/2,
                                                                                                                    'left': ($(window).width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').width())/2});
                        if (lightboxCurrentImage == 0){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID).css('display', 'none');                         
                        }
                        
                        if (lightboxCurrentImage == 0 || lightboxImageLoaded){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxLoader').css('display', 'none');
                        }
                        
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').css({'height': $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().height(),
                                                                                                              'width': $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().width()});

                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().css({'margin-top': LightboxPaddingTop,
                                                                                                                         'margin-left': LightboxPaddingLeft});
                                                                                                                  
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height(currH+LightboxPaddingTop+LightboxPaddingBottom);
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxBg').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxBg').height(currH+LightboxPaddingTop+LightboxPaddingBottom);
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css({'margin-top': ($(window).height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height())/2+$(window).scrollTop(),
                                                                                                                       'margin-left': ($(window).width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width())/2+$(window).scrollLeft()});                                                                                                                                                                                                                                              
                        methods.rpLightboxNavigation();
                    },
                    rpLightboxNavigation:function(){// Resize & Position Lightbox Navigation
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigationButtons').css({'margin-top': ($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigationButtons').height())/2,
                                                                                                                               'left': LightboxPaddingLeft,
                                                                                                                               'width': $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().width()});                 
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigationExtraButtons').css({'margin-top': LightboxPaddingTop+10,
                                                                                                                                    'left': LightboxPaddingLeft,
                                                                                                                                    'width': $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_Lightbox').children().width()});
                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info').css({'margin-top': $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').height()-LightboxPaddingBottom-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info').height(),
                                                                                                                             'left': ($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width()-$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation_Info').width())/2});                        
                    },     
                    lightboxNavigationSwipe:function(){
                        var prev, curr, touch, initial, positionX;

                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').bind('touchstart', function(e){
                            touch = e.originalEvent.touches[0];
                            prev = touch.clientX;
                            initial = parseFloat($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left')); 
                        });

                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').bind('touchmove', function(e){
                            e.preventDefault();
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').css('opacity', 0);

                            touch = e.originalEvent.touches[0],
                            curr = touch.clientX,
                            positionX = curr>prev ? parseInt($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left'))+(curr-prev):parseInt($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left'))-(prev-curr);

                            methods.navigationDisplay('none'); 
                            prev = curr;
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left', positionX);
                        });

                        $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').bind('touchend', function(e){
                            if (!prototypes.isChromeMobileBrowser()){
                                e.preventDefault();
                            }
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxNavigation').css('opacity', 1);
                                
                            if (parseFloat($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left')) < 0 && lightboxCurrentImage < noImages){
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css({'margin-left': initial, 'opacity': 0});
                                methods.nextLightbox();
                            }
                            else if (parseFloat($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left'))+$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').width() > $(window).width() && lightboxCurrentImage > 1){
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css({'margin-left': initial, 'opacity': 0});
                                methods.previousLightbox();
                            }
                            else{
                                $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxContainer').css('margin-left', initial);
                            }
                        });
                    },           
                                        
                    initSocialShare:function(){
                        var HTML = new Array(), HTMLLightbox = new Array();
                        
                        HTML.push('       <div class="addthis_toolbox addthis_default_style">');
                        HTML.push('            <a class="addthis_button" addthis:url="" addthis:title="">');
                        HTML.push('                <img src="'+SocialShare+'" alt="" />');                            
                        HTML.push('            </a>');
                        HTML.push('       </div>');
                        
                        HTMLLightbox.push('       <div class="addthis_toolbox addthis_default_style">');
                        HTMLLightbox.push('            <a class="addthis_button" addthis:url="" addthis:title="">');
                        HTMLLightbox.push('                <img src="'+SocialShareLightbox+'" alt="" />');
                        HTMLLightbox.push('            </a>');
                        HTMLLightbox.push('       </div>');
                        
                        if ($('.DOP_ThumbnailGallery_SocialShare', Container).html() == ''){
                            $('.DOP_ThumbnailGallery_SocialShare', Container).html(HTML.join(''));
                        }
                        
                        if ($('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxSocialShare').html() == ''){
                            $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxSocialShare').html(HTMLLightbox.join(''));                            
                        }
                    },
                    showSocialShare:function(lightbox){
                        var URL = window.location.href+(window.location.href.indexOf('?') != -1 ? '&':'?')+'dop_thumbnail_gallery_id='+ID+'&dop_thumbnail_gallery_share='+currentImage+'&dop_thumbnail_gallery_lightbox='+lightbox;
                        
                        if (window.addthis == undefined){
                            $.getScript( 'http://s7.addthis.com/js/250/addthis_widget.js' , function(){
                                if (window.addthis){ 
                                    window.addthis.ost = 0; 
                                    window.addthis.init();

                                    setTimeout(function(){
                                        window.addthis.update('share', 'url', URL);
                                        window.addthis.update('share', 'title', CaptionTitle[currentImage-1]);
                                    }, 100);

                                    $('#at15s').css('top', parseFloat($('#at15s').css('top'))-$(window).scrollTop());
                                } 
                            }); 
                        }
                        else{
                            setTimeout(function(){
                                window.addthis.update('share', 'url', URL);
                                window.addthis.update('share', 'title', CaptionTitle[currentImage-1]);
                            }, 100);
                        }
                        
                        clearInterval(socialShareInterval);
                        socialShareInterval = setInterval(methods.rpSocialShare, 100);
                    },
                    rpSocialShare:function(){
                        if ($('#at15s') != undefined && lightboxImageLoaded){
                            $('#at15s').css('top', $('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxSocialShare').offset().top+$('#DOP_ThumbnailGallery_LightboxWrapper_'+ID+' .DOP_ThumbnailGallery_LightboxSocialShare').children().height()-$(window).scrollTop());
                        }
                    },
                    
                    initTooltip:function(){// Init Tooltip                        
                        $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).mousemove(function(e){
                            var mousePositionX = e.clientX-$(this).offset().left+parseInt($(this).css('margin-left'))+$(document).scrollLeft();
                            var mousePositionY = e.clientY-$(this).offset().top+parseInt($(this).css('margin-top'))+$(document).scrollTop();

                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('margin-left', mousePositionX-10);
                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('margin-top', mousePositionY-$('.DOP_ThumbnailGallery_Tooltip', Container).height()-15);
                        });
                    },
                    showTooltip:function(no){// Resize, Position & Display the Tooltip
                        var HTML = new Array();
                        HTML.push(CaptionTitle[no]);
                        HTML.push('<div class="DOP_ThumbnailGallery_Tooltip_ArrowBorder"></div>');
                        HTML.push('<div class="DOP_ThumbnailGallery_Tooltip_Arrow"></div>');
                        $('.DOP_ThumbnailGallery_Tooltip', Container).html(HTML.join(""));

                        if (TooltipBgColor != 'css'){
                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('background-color', '#'+TooltipBgColor);
                            $('.DOP_ThumbnailGallery_Tooltip_Arrow', Container).css('border-top-color', '#'+TooltipBgColor);
                        }
                        if (TooltipStrokeColor != 'css'){
                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('border-color', '#'+TooltipStrokeColor);
                            $('.DOP_ThumbnailGallery_Tooltip_ArrowBorder', Container).css('border-top-color', '#'+TooltipStrokeColor);
                        }
                        if (TooltipTextColor != 'css'){
                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('color', '#'+TooltipTextColor);
                        }
                        if (CaptionTitle[no] != '' || prototypes.isTouchDevice()){
                            $('.DOP_ThumbnailGallery_Tooltip', Container).css('display', 'block');
                        }
                    },

                    initAutoHide:function(){// Init Auto Hide
                        HideID = setInterval(methods.hideItems, parseInt(AutoHideTime));

                        $('.DOP_ThumbnailGallery_Container', Container).hover(function(){
                            methods.showItems();
                        }, function(){
                            HideID = setInterval(methods.hideItems, parseInt(AutoHideTime));
                        });
                    },
                    showItems:function(){// Show Items
                        clearInterval(HideID);
                        ItemsHidden = false;

                        if (imageLoaded){
                            methods.navigationDisplay('block');
                        }

                        if (ThumbnailsPosition == 'top'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': 0}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'right'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': $('.DOP_ThumbnailGallery_Container', Container).width()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'bottom'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': $('.DOP_ThumbnailGallery_Container', Container).height()-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height()}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'left'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': 0}, AutoHideDisplayTime);
                        }
                        methods.showCaption();
                    },
                    hideItems:function(){// Hide Items
                        clearInterval(HideID);
                        ItemsHidden = true;

                        if (NavigationEnabled == 'true'){     
                            methods.navigationDisplay('none');
                        }

                        if (ThumbnailsPosition == 'top'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': 0-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).height()}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'right'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': $('.DOP_ThumbnailGallery_Container', Container).width()}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'bottom'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-top': $('.DOP_ThumbnailGallery_Container', Container).height()}, AutoHideDisplayTime);
                        }
                        if (ThumbnailsPosition == 'left'){
                            $('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).stop(true, true).animate({'margin-left': 0-$('.DOP_ThumbnailGallery_ThumbnailsContainer', Container).width()}, AutoHideDisplayTime);
                        }
                        methods.hideCaption();
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
                                
                            if (item.prop('tagName') != undefined && item.prop('tagName').toLowerCase() != 'body'){
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