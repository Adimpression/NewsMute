
/*
* Title                   : Wall/Grid Gallery (jQuery Plugin)
* Version                 : 1.8
* File                    : jquery.dop.WallGridGallery.js
* File Version            : 1.8
* Created / Last Modified : 30 March 2013
* Author                  : Dot on Paper
* Copyright               : © 2011 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Wall/Grid Gallery jQuery plugin.
*/

(function($){
    $.fn.DOPWallGridGallery = function(options){
        var Data = {'ID': 1,
                    'SettingsDataType': 'JSON',
                    'SettingsFilePath': 'dopwgg/json/settings.json',
                    'ContentDataType': 'JSON',
                    'ContentFilePath':'dopwgg/json/content.json'},

        Container = this,
        ID = '',
        
        Width = 900,
        Height = 0,
        BgColor = 'ffffff',
        BgAlpha = 100,
        NoLines = 3,
        NoColumns = 4,
        ImagesOrder = 'normal',
        ResponsiveEnabled = 'true',

        ThumbnailsSpacing = 15,
        ThumbnailsPaddingTop = 0,
        ThumbnailsPaddingRight = 0,
        ThumbnailsPaddingBottom = 0,
        ThumbnailsPaddingLeft = 0,
        ThumbnailsNavigation = 'mouse',
        ThumbnailsScrollScrubColor = '777777',
        ThumbnailsScrollBarColor = 'e0e0e0',
        ThumbnailsInfo = 'none',

        ThumbnailLoader = 'dopwgg/assets/gui/images/ThumbnailLoader.gif',
        ThumbnailIconsColor = 'af3425',
        ThumbnailWidth = 200,
        ThumbnailHeight = 100,
        ThumbnailWidthDesktop = 200,
        ThumbnailHeightDesktop = 100,
        ThumbnailWidthMobile = 100,
        ThumbnailHeightMobile = 50,
        ThumbnailAlpha = 80,
        ThumbnailAlphaHover = 100,
        ThumbnailBgColor = 'cccccc',
        ThumbnailBgColorHover = '000000',
        ThumbnailBorderSize = 0,
        ThumbnailBorderColor = 'cccccc',
        ThumbnailBorderColorHover = '000000',
        ThumbnailPaddingTop = 3,
        ThumbnailPaddingRight = 3,
        ThumbnailPaddingBottom = 3,
        ThumbnailPaddingLeft = 3,   
                                            
        LightboxPosition = 'document',
        LightboxWindowColor = '000000',
        LightboxWindowAlpha = 80,
        LightboxLoader = 'dopwgg/assets/gui/images/LightboxLoader.gif',
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

        LightboxNavigationPrev = 'dopwgg/assets/gui/images/LightboxPrev.png',
        LightboxNavigationPrevHover = 'dopwgg/assets/gui/images/LightboxPrevHover.png',
        LightboxNavigationNext = 'dopwgg/assets/gui/images/LightboxNext.png',
        LightboxNavigationNextHover = 'dopwgg/assets/gui/images/LightboxNextHover.png',
        LightboxNavigationClose = 'dopwgg/assets/gui/images/LightboxClose.png',
        LightboxNavigationCloseHover = 'dopwgg/assets/gui/images/LightboxCloseHover.png',                                    
        
        CaptionHeight = 75,
        CaptionTitleColor = 'eeeeee',
        CaptionTextColor = 'dddddd',
        CaptionScrollScrubColor = '777777',
        CaptionScrollBgColor = 'e0e0e0',  
        
        SocialShareEnabled = 'true',
        SocialShareLightbox = 'dopwgg/assets/gui/images/SocialShareLightbox.png',     

        TooltipBgColor = 'ffffff',
        TooltipStrokeColor = '000000',
        TooltipTextColor = '000000',                                  
        
        LabelPosition = 'bottom',
        LabelTextColor = '000000',
        LabelTextColorHover = 'ffffff',
        
        Images = new Array(),
        Thumbs = new Array(),
        ThumbsWidth = new Array(),
        ThumbsHeight = new Array(),
        ThumbsLoaded = new Array(),
        ThumbsFirstPosX = new Array(),
        ThumbsFirstPosY = new Array(),
        CaptionTitle = new Array(),
        CaptionText = new Array(),
        Media = new Array(),
        Links = new Array(),
        LinksTarget = new Array(),
        noItems = 0,
        
        startGalleryID = 0,
        startWith = 0,
        
        initialWidth = Width,
        
        currentItem = 0,
        itemLoaded = false,
        ImageWidth = 0,
        ImageHeight = 0,
        LightboxDisplayTime = 600,
        LightboxNavigationDisplayTime = 600,
        
        socialShareInterval,
        
        methods = {
                    init:function( ){// Init Plugin.
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
                            $(window).bind('resize.DOPWallGridGallery', methods.initRP);
                            $(window).bind('scroll.DOPWallGridGallery', methods.initRPScroll);
                        });
                    },
                    
                    parseJSONSettings:function(){// Parse Settings.                        
                        $.getJSON(prototypes.acaoBuster(Data['SettingsFilePath']), {}, function(data){  
                            Width = parseInt(data['Width']);
                            Height = parseInt(data['Height']);
                            BgColor = data['BgColor'] || 'ffffff';
                            BgAlpha = parseInt(data['BgAlpha']);
                            NoLines = parseInt(data['NoLines']);
                            NoColumns = parseInt(data['NoColumns']);
                            ImagesOrder = data['ImagesOrder'] || 'normal';
                            ResponsiveEnabled = data['ResponsiveEnabled'] || 'true';

                            ThumbnailsSpacing = parseInt(data['ThumbnailsSpacing']);
                            ThumbnailsPaddingTop = parseInt(data['ThumbnailsPaddingTop']);
                            ThumbnailsPaddingRight = parseInt(data['ThumbnailsPaddingRight']);
                            ThumbnailsPaddingBottom = parseInt(data['ThumbnailsPaddingBottom']);
                            ThumbnailsPaddingLeft = parseInt(data['ThumbnailsPaddingLeft']);
                            ThumbnailsNavigation = data['ThumbnailsNavigation'] || 'mouse';
                            ThumbnailsScrollScrubColor = data['ThumbnailsScrollScrubColor'] || '777777';
                            ThumbnailsScrollBarColor = data['ThumbnailsScrollBarColor'] || 'e0e0e0';
                            ThumbnailsInfo = data['ThumbnailsInfo'] || 'none';

                            ThumbnailLoader = data['ThumbnailLoader'] || 'dopwgg/assets/gui/images/ThumbnailLoader.gif';
                            ThumbnailIconsColor = data['ThumbnailIconsColor'] || 'af3425';
                            ThumbnailWidth = parseInt(data['ThumbnailWidth']);
                            ThumbnailHeight = parseInt(data['ThumbnailHeight']);
                            ThumbnailWidthDesktop = parseInt(data['ThumbnailWidth']);
                            ThumbnailHeightDesktop = parseInt(data['ThumbnailHeight']);
                            ThumbnailWidthMobile = parseInt(data['ThumbnailWidthMobile']);
                            ThumbnailHeightMobile = parseInt(data['ThumbnailHeightMobile']);
                            ThumbnailAlpha = parseInt(data['ThumbnailAlpha']);
                            ThumbnailAlphaHover = parseInt(data['ThumbnailAlphaHover']);
                            ThumbnailBgColor = data['ThumbnailBgColor'] || 'cccccc';
                            ThumbnailBgColorHover = data['ThumbnailBgColorHover'] || '000000';
                            ThumbnailBorderSize = parseInt(data['ThumbnailBorderSize']);
                            ThumbnailBorderColor = data['ThumbnailBorderColor'] || 'cccccc';
                            ThumbnailBorderColorHover = data['ThumbnailBorderColorHover'] || '000000';
                            ThumbnailPaddingTop = parseInt(data['ThumbnailPaddingTop']);
                            ThumbnailPaddingRight = parseInt(data['ThumbnailPaddingRight']);
                            ThumbnailPaddingBottom = parseInt(data['ThumbnailPaddingBottom']);
                            ThumbnailPaddingLeft = parseInt(data['ThumbnailPaddingLeft']);

                            LightboxPosition = data['LightboxPosition'] || 'document';
                            LightboxWindowColor = data['LightboxWindowColor'] || '000000';
                            LightboxWindowAlpha = parseInt(data['LightboxWindowAlpha']);
                            LightboxLoader = data['LightboxLoader'] || 'dopwgg/assets/gui/images/LightboxLoader.gif';
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

                            LightboxNavigationPrev = data['LightboxNavigationPrev'] || 'dopwgg/assets/gui/images/LightboxPrev.png';
                            LightboxNavigationPrevHover = data['LightboxNavigationPrevHover'] || 'dopwgg/assets/gui/images/LightboxPrevHover.png';
                            LightboxNavigationNext = data['LightboxNavigationNext'] || 'dopwgg/assets/gui/images/LightboxNext.png';
                            LightboxNavigationNextHover = data['LightboxNavigationNextHover'] || 'dopwgg/assets/gui/images/LightboxNextHover.png';
                            LightboxNavigationClose = data['LightboxNavigationClose'] || 'dopwgg/assets/gui/images/LightboxClose.png';
                            LightboxNavigationCloseHover = data['LightboxNavigationCloseHover'] || 'dopwgg/assets/gui/images/LightboxCloseHover.png';

                            CaptionHeight = parseInt(data['CaptionHeight']);
                            CaptionTitleColor = data['CaptionTitleColor'] || 'eeeeee';
                            CaptionTextColor = data['CaptionTextColor'] || 'dddddd';
                            CaptionScrollScrubColor = data['CaptionScrollScrubColor'] || '777777';
                            CaptionScrollBgColor = data['CaptionScrollBgColor'] || 'e0e0e0';
                            
                            SocialShareEnabled = data['SocialShareEnabled'] || 'true';
                            SocialShareLightbox = data['SocialShareLightbox'] || 'dopwgg/assets/gui/images/SocialShareLightbox.png';

                            TooltipBgColor = data['TooltipBgColor'] || 'ffffff';
                            TooltipStrokeColor = data['TooltipStrokeColor'] || '000000';
                            TooltipTextColor = data['TooltipTextColor'] || '000000';

                            LabelPosition = data['LabelPosition'] || 'bottom';
                            LabelTextColor = data['LabelTextColor'] || '000000';
                            LabelTextColorHover = data['LabelTextColorHover'] || 'ffffff';
                            
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
                                                        
                            Width = parseInt($xml.find('Width').text());
                            Height = parseInt($xml.find('Height').text());
                            BgColor = $xml.find('BgColor').text() || 'ffffff';
                            BgAlpha = parseInt($xml.find('BgAlpha').text());
                            NoLines = parseInt($xml.find('NoLines').text());
                            NoColumns = parseInt($xml.find('NoColumns').text());
                            ImagesOrder = $xml.find('ImagesOrder').text() || 'normal';
                            ResponsiveEnabled = $xml.find('ResponsiveEnabled').text() || 'true';

                            ThumbnailsSpacing = parseInt($xml.find('ThumbnailsSpacing').text());
                            ThumbnailsPaddingTop = parseInt($xml.find('ThumbnailsPaddingTop').text());
                            ThumbnailsPaddingRight = parseInt($xml.find('ThumbnailsPaddingRight').text());
                            ThumbnailsPaddingBottom = parseInt($xml.find('ThumbnailsPaddingBottom').text());
                            ThumbnailsPaddingLeft = parseInt($xml.find('ThumbnailsPaddingLeft').text());
                            ThumbnailsNavigation = $xml.find('ThumbnailsNavigation').text() || 'mouse';
                            ThumbnailsScrollScrubColor = $xml.find('ThumbnailsScrollScrubColor').text() || '777777';
                            ThumbnailsScrollBarColor = $xml.find('ThumbnailsScrollBarColor').text() || 'e0e0e0';
                            ThumbnailsInfo = $xml.find('ThumbnailsInfo').text() || 'none';

                            ThumbnailLoader = $xml.find('ThumbnailLoader').text() || 'dopwgg/assets/gui/images/ThumbnailLoader.gif';
                            ThumbnailIconsColor = $xml.find('ThumbnailIconsColor').text() || 'af3425';
                            ThumbnailWidth = parseInt($xml.find('ThumbnailWidth').text());
                            ThumbnailHeight = parseInt($xml.find('ThumbnailHeight').text());
                            ThumbnailWidthDesktop = parseInt($xml.find('ThumbnailWidth').text());
                            ThumbnailHeightDesktop = parseInt($xml.find('ThumbnailHeight').text());
                            ThumbnailWidthMobile = parseInt($xml.find('ThumbnailWidthMobile').text());
                            ThumbnailHeightMobile = parseInt($xml.find('ThumbnailHeightMobile').text());
                            ThumbnailAlpha = parseInt($xml.find('ThumbnailAlpha').text());
                            ThumbnailAlphaHover = parseInt($xml.find('ThumbnailAlphaHover').text());
                            ThumbnailBgColor = $xml.find('ThumbnailBgColor').text() || 'cccccc';
                            ThumbnailBgColorHover = $xml.find('ThumbnailBgColorHover').text() || '000000';
                            ThumbnailBorderSize = parseInt($xml.find('ThumbnailBorderSize').text());
                            ThumbnailBorderColor = $xml.find('ThumbnailBorderColor').text() || 'cccccc';
                            ThumbnailBorderColorHover = $xml.find('ThumbnailBorderColorHover').text() || '000000';
                            ThumbnailPaddingTop = parseInt($xml.find('ThumbnailPaddingTop').text());
                            ThumbnailPaddingRight = parseInt($xml.find('ThumbnailPaddingRight').text());
                            ThumbnailPaddingBottom = parseInt($xml.find('ThumbnailPaddingBottom').text());
                            ThumbnailPaddingLeft = parseInt($xml.find('ThumbnailPaddingLeft').text());

                            LightboxPosition = $xml.find('LightboxPosition').text() || 'document';
                            LightboxWindowColor = $xml.find('LightboxWindowColor').text() || '000000';
                            LightboxWindowAlpha = parseInt($xml.find('LightboxWindowAlpha').text());
                            LightboxLoader = $xml.find('LightboxLoader').text() || 'dopwgg/assets/gui/images/LightboxLoader.gif';
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

                            LightboxNavigationPrev = $xml.find('LightboxNavigationPrev').text() || 'dopwgg/assets/gui/images/LightboxPrev.png';
                            LightboxNavigationPrevHover = $xml.find('LightboxNavigationPrevHover').text() || 'dopwgg/assets/gui/images/LightboxPrevHover.png';
                            LightboxNavigationNext = $xml.find('LightboxNavigationNext').text() || 'dopwgg/assets/gui/images/LightboxNext.png';
                            LightboxNavigationNextHover = $xml.find('LightboxNavigationNextHover').text() || 'dopwgg/assets/gui/images/LightboxNextHover.png';
                            LightboxNavigationClose = $xml.find('LightboxNavigationClose').text() || 'dopwgg/assets/gui/images/LightboxClose.png';
                            LightboxNavigationCloseHover = $xml.find('LightboxNavigationCloseHover').text() || 'dopwgg/assets/gui/images/LightboxCloseHover.png';

                            CaptionHeight = parseInt($xml.find('CaptionHeight').text());
                            CaptionTitleColor = $xml.find('CaptionTitleColor').text() || 'eeeeee';
                            CaptionTextColor = $xml.find('CaptionTextColor').text() || 'dddddd';
                            CaptionScrollScrubColor = $xml.find('CaptionScrollScrubColor').text() || '777777';
                            CaptionScrollBgColor = $xml.find('CaptionScrollBgColor').text() || 'e0e0e0';
                            
                            SocialShareEnabled = $xml.find('SocialShareEnabled').text() || 'true';
                            SocialShareLightbox = $xml.find('SocialShareLightbox').text() || 'dopwgg/assets/gui/images/SocialShareLightbox.png';

                            TooltipBgColor = $xml.find('TooltipBgColor').text() || 'ffffff';
                            TooltipStrokeColor = $xml.find('TooltipStrokeColor').text() || '000000';
                            TooltipTextColor = $xml.find('TooltipTextColor').text() || '000000';

                            LabelPosition = $xml.find('LabelPosition').text() || 'bottom';
                            LabelTextColor = $xml.find('LabelTextColor').text() || '000000';
                            LabelTextColorHover = $xml.find('LabelTextColorHover').text() || 'ffffff';
                            
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
                        Width = parseInt($('.Settings li.Width', Container).html());
                        Height = parseInt($('.Settings li.Height', Container).html());
                        BgColor = $('.Settings li.BgColor', Container).html() || 'ffffff';
                        BgAlpha = parseInt($('.Settings li.BgAlpha', Container).html());
                        NoLines = parseInt($('.Settings li.NoLines', Container).html());
                        NoColumns = parseInt($('.Settings li.NoColumns', Container).html());
                        ImagesOrder = $('.Settings li.ImagesOrder', Container).html() || 'normal';
                        ResponsiveEnabled = $('.Settings li.ResponsiveEnabled', Container).html() || 'true';

                        ThumbnailsSpacing = parseInt($('.Settings li.ThumbnailsSpacing', Container).html());
                        ThumbnailsPaddingTop = parseInt($('.Settings li.ThumbnailsPaddingTop', Container).html());
                        ThumbnailsPaddingRight = parseInt($('.Settings li.ThumbnailsPaddingRight', Container).html());
                        ThumbnailsPaddingBottom = parseInt($('.Settings li.ThumbnailsPaddingBottom', Container).html());
                        ThumbnailsPaddingLeft = parseInt($('.Settings li.ThumbnailsPaddingLeft', Container).html());
                        ThumbnailsNavigation = $('.Settings li.ThumbnailsNavigation', Container).html() || 'mouse';
                        ThumbnailsScrollScrubColor = $('.Settings li.ThumbnailsScrollScrubColor', Container).html() || '777777';
                        ThumbnailsScrollBarColor = $('.Settings li.ThumbnailsScrollBarColor', Container).html() || 'e0e0e0';
                        ThumbnailsInfo = $('.Settings li.ThumbnailsInfo', Container).html() || 'none';

                        ThumbnailLoader = $('.Settings li.ThumbnailLoader', Container).html() || 'dopwgg/assets/gui/images/ThumbnailLoader.gif';
                        ThumbnailIconsColor = $('.Settings li.ThumbnailIconsColor', Container).html() || 'af3425';
                        ThumbnailWidth = parseInt($('.Settings li.ThumbnailWidth', Container).html());
                        ThumbnailHeight = parseInt($('.Settings li.ThumbnailHeight', Container).html());
                        ThumbnailWidthDesktop = parseInt($('.Settings li.ThumbnailWidth', Container).html());
                        ThumbnailHeightDesktop = parseInt($('.Settings li.ThumbnailHeight', Container).html());
                        ThumbnailWidthMobile = parseInt($('.Settings li.ThumbnailWidthMobile', Container).html());
                        ThumbnailHeightMobile = parseInt($('.Settings li.ThumbnailHeightMobile', Container).html());
                        ThumbnailAlpha = parseInt($('.Settings li.ThumbnailAlpha', Container).html());
                        ThumbnailAlphaHover = parseInt($('.Settings li.ThumbnailAlphaHover', Container).html());
                        ThumbnailBgColor = $('.Settings li.ThumbnailBgColor', Container).html() || 'cccccc';
                        ThumbnailBgColorHover = $('.Settings li.ThumbnailBgColorHover', Container).html() || '000000';
                        ThumbnailBorderSize = parseInt($('.Settings li.ThumbnailBorderSize', Container).html());
                        ThumbnailBorderColor = $('.Settings li.ThumbnailBorderColor', Container).html() || 'cccccc';
                        ThumbnailBorderColorHover = $('.Settings li.ThumbnailBorderColorHover', Container).html() || '000000';
                        ThumbnailPaddingTop = parseInt($('.Settings li.ThumbnailPaddingTop', Container).html());
                        ThumbnailPaddingRight = parseInt($('.Settings li.ThumbnailPaddingRight', Container).html());
                        ThumbnailPaddingBottom = parseInt($('.Settings li.ThumbnailPaddingBottom', Container).html());
                        ThumbnailPaddingLeft = parseInt($('.Settings li.ThumbnailPaddingLeft', Container).html());

                        LightboxPosition = $('.Settings li.LightboxPosition', Container).html() || 'document';
                        LightboxWindowColor = $('.Settings li.LightboxWindowColor', Container).html() || '000000';
                        LightboxWindowAlpha = parseInt($('.Settings li.LightboxWindowAlpha', Container).html());
                        LightboxLoader = $('.Settings li.LightboxLoader', Container).html() || 'dopwgg/assets/gui/images/LightboxLoader.gif';
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

                        LightboxNavigationPrev = $('.Settings li.LightboxNavigationPrev', Container).html() || 'dopwgg/assets/gui/images/LightboxPrev.png';
                        LightboxNavigationPrevHover = $('.Settings li.LightboxNavigationPrevHover', Container).html() || 'dopwgg/assets/gui/images/LightboxPrevHover.png';
                        LightboxNavigationNext = $('.Settings li.LightboxNavigationNext', Container).html() || 'dopwgg/assets/gui/images/LightboxNext.png';
                        LightboxNavigationNextHover = $('.Settings li.LightboxNavigationNextHover', Container).html() || 'dopwgg/assets/gui/images/LightboxNextHover.png';
                        LightboxNavigationClose = $('.Settings li.LightboxNavigationClose', Container).html() || 'dopwgg/assets/gui/images/LightboxClose.png';
                        LightboxNavigationCloseHover = $('.Settings li.LightboxNavigationCloseHover', Container).html() || 'dopwgg/assets/gui/images/LightboxCloseHover.png';

                        CaptionHeight = parseInt($('.Settings li.CaptionHeight', Container).html());
                        CaptionTitleColor = $('.Settings li.CaptionTitleColor', Container).html() || 'eeeeee';
                        CaptionTextColor = $('.Settings li.CaptionTextColor', Container).html() || 'dddddd';
                        CaptionScrollScrubColor = $('.Settings li.CaptionScrollScrubColor', Container).html() || '777777';
                        CaptionScrollBgColor = $('.Settings li.CaptionScrollBgColor', Container).html() || 'e0e0e0';
                        
                        SocialShareEnabled = $('.Settings li.SocialShareEnabled', Container).html() || 'true';
                        SocialShareLightbox = $('.Settings li.SocialShareLightbox', Container).html() || 'dopwgg/assets/gui/images/SocialShareLightbox.png';

                        TooltipBgColor = $('.Settings li.TooltipBgColor', Container).html() || 'ffffff';
                        TooltipStrokeColor = $('.Settings li.TooltipStrokeColor', Container).html() || '000000';
                        TooltipTextColor = $('.Settings li.TooltipTextColor', Container).html() || '000000';

                        LabelPosition = $('.Settings li.LabelPosition', Container).html() || 'bottom';
                        LabelTextColor = $('.Settings li.LabelTextColor', Container).html() || '000000';
                        LabelTextColorHover = $('.Settings li.LabelTextColorHover', Container).html() || 'ffffff';
                            
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
                                        case 'Link':
                                            Links.push(data[index][key]);break;
                                        case 'LinkTarget':
                                            LinksTarget.push(data[index][key]);break;
                                    }
                                });
                            });

                            noItems = Images.length;
                            
                            if (ImagesOrder == 'random'){
                                methods.randomizeItems();
                            }
                        
                            initialWidth = Width;
                            
                            if (ResponsiveEnabled == 'true'){  
                                methods.rpResponsive();   
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
                            $(xml).find('Link').each(function(){
                                Links.push($(this).text());
                            });
                            $(xml).find('LinkTarget').each(function(){
                                LinksTarget.push($(this).text());
                            });
                            
                            noItems = Images.length;
                                                       
                            if (ImagesOrder == 'random'){
                                methods.randomizeItems();
                            }
                        
                            initialWidth = Width;
                            
                            if (ResponsiveEnabled == 'true'){  
                                methods.rpResponsive();   
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
                            Links.push($('.Link', this).html());
                            LinksTarget.push($('.Target', this).html());
                        });

                        noItems = Images.length;

                        if (ImagesOrder == 'random'){
                            methods.randomizeItems();
                        }
                        
                        initialWidth = Width;

                        if (ResponsiveEnabled == 'true'){  
                            methods.rpResponsive();   
                        }

                        methods.initGallery();
                    },  
                    
                    randomizeItems:function(){
                        var indexes = new Array(), i,
                        auxImages = new Array(),
                        auxThumbs = new Array(),
                        auxCaptionTitle = new Array(),
                        auxCaptionText = new Array(),
                        auxMedia = new Array(),
                        auxLinks = new Array(),
                        auxLinksTarget = new Array();
                                                
                        for (i=0; i<noItems; i++){
                            indexes[i] = i;
                            auxImages[i] = Images[i];
                            auxThumbs[i] = Thumbs[i];
                            auxCaptionTitle[i] = CaptionTitle[i];
                            auxCaptionText[i] = CaptionText[i];
                            auxMedia[i] = Media[i];
                            auxLinks[i] = Links[i];
                            auxLinksTarget[i] = LinksTarget[i];
                        }
                        
                        indexes =  prototypes.randomize(indexes);
                        
                        for (i=0; i<noItems; i++){
                            Images[i] = auxImages[indexes[i]];
                            Thumbs[i] = auxThumbs[indexes[i]];
                            CaptionTitle[i] = auxCaptionTitle[indexes[i]];
                            CaptionText[i] = auxCaptionText[indexes[i]];
                            Media[i] = auxMedia[indexes[i]];
                            Links[i] = auxLinks[indexes[i]];
                            LinksTarget[i] = auxLinksTarget[indexes[i]];
                        }
                    },
                    initGallery:function(){// Init the Gallery
                        var LightboxHTML = new Array(),
                        HTML = new Array();

                        LightboxHTML.push('    <div class="DOP_WallGridGallery_LightboxWrapper" id="DOP_WallGridGallery_LightboxWrapper_'+ID+'">');
                        LightboxHTML.push('        <div class="DOP_WallGridGallery_LightboxWindow"></div>');
                        LightboxHTML.push('        <div class="DOP_WallGridGallery_LightboxLoader"><img src="'+LightboxLoader+'" alt="" /></div>');
                        LightboxHTML.push('        <div class="DOP_WallGridGallery_LightboxContainer">');
                        LightboxHTML.push('            <div class="DOP_WallGridGallery_LightboxBg"></div>');
                        LightboxHTML.push('            <div class="DOP_WallGridGallery_Lightbox"></div>');
                        LightboxHTML.push('            <div class="DOP_WallGridGallery_LightboxNavigation">');
                        LightboxHTML.push('                <div class="DOP_WallGridGallery_LightboxNavigationExtraButtons">');         
                        LightboxHTML.push('                    <div class="DOP_WallGridGallery_LightboxNavigation_CloseBtn">');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationClose+'" class="normal" alt="" />');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationCloseHover+'" class="hover" alt="" />');   
                        LightboxHTML.push('                    </div>'); 
                        if (SocialShareEnabled == 'true'){
                            LightboxHTML.push('                    <div class="DOP_WallGridGallery_LightboxSocialShare"></div>');
                        } 
                        LightboxHTML.push('                    <br class="DOP_WallGridGallery_Clear" />'); 
                        LightboxHTML.push('                </div>');      
                        LightboxHTML.push('                <div class="DOP_WallGridGallery_LightboxNavigationButtons">');
                        LightboxHTML.push('                    <div class="DOP_WallGridGallery_LightboxNavigation_PrevBtn">');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationPrev+'" class="normal" alt="" />');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationPrevHover+'" class="hover" alt="" />');   
                        LightboxHTML.push('                    </div>');   
                        LightboxHTML.push('                    <div class="DOP_WallGridGallery_LightboxNavigation_NextBtn">');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationNext+'" class="normal" alt="" />');
                        LightboxHTML.push('                        <img src="'+LightboxNavigationNextHover+'" class="hover" alt="" />');   
                        LightboxHTML.push('                    </div>'); 
                        LightboxHTML.push('                    <br class="DOP_WallGridGallery_Clear" />'); 
                        LightboxHTML.push('                </div>');             
                        LightboxHTML.push('            </div>');
                        LightboxHTML.push('            <div class="DOP_WallGridGallery_Caption">');
                        LightboxHTML.push('                <div class="DOP_WallGridGallery_CaptionTextWrapper">');
                        LightboxHTML.push('                    <div class="DOP_WallGridGallery_CaptionTitle">');
                        LightboxHTML.push('                        <div class="title"></div>');
                        LightboxHTML.push('                        <div class="count"><span id="DOP_WallGridGallery_ItemCount_'+ID+'"></span> / '+noItems+'</div>');
                        LightboxHTML.push('                        <br style="clear:both;" />');
                        LightboxHTML.push('                    </div>');
                        LightboxHTML.push('                    <div class="DOP_WallGridGallery_CaptionTextContainer">');
                        LightboxHTML.push('                        <div class="DOP_WallGridGallery_CaptionText"></div>');
                        LightboxHTML.push('                    </div>');
                        LightboxHTML.push('                </div>');
                        LightboxHTML.push('            </div>');         
                        LightboxHTML.push('        </div>');
                        LightboxHTML.push('    </div>');

                        HTML.push('<div class="DOP_WallGridGallery_Container">');
                        HTML.push('   <div class="DOP_WallGridGallery_Background"></div>');
                        HTML.push('   <div class="DOP_WallGridGallery_ThumbnailsWrapper">');
                        HTML.push('       <div class="DOP_WallGridGallery_Thumbnails"></div>');
                        HTML.push('   </div>');
                        
                        if (ThumbnailsInfo == 'tooltip' && !prototypes.isTouchDevice()){
                            HTML.push('<div class="DOP_WallGridGallery_Tooltip"></div>');
                        }                        
                        
                        if (LightboxPosition != 'document'){
                            HTML.push(LightboxHTML.join(''));
                        }
                        HTML.push('</div>');

                        Container.html(HTML.join(''));
                        
                        if (LightboxPosition == 'document'){
                            $('body').append(LightboxHTML.join(''));
                        }
                        methods.initSettings();
                    },
                    initSettings:function(){// Init Settings
                        methods.initContainer();
                        methods.initBackground();
                        methods.initThumbnails();
                        
                        if (ThumbnailsInfo == 'tooltip' && !prototypes.isTouchDevice()){
                            methods.initTooltip();
                        }
                        methods.initLightbox();
                        methods.initCaption();
                        
                        if (SocialShareEnabled == 'true'){
                            methods.initSocialShare();
                        }
                    },
                    initRP:function(){// Init Resize & Positioning
                        if (ResponsiveEnabled == 'true'){   
                            methods.rpResponsive();    
                            methods.rpContainer();
                            methods.rpBackground();
                            methods.rpThumbnails();

                            if (itemLoaded){
                                if (Media[currentItem-1] == ''){
                                    methods.rpLightboxImage();
                                }
                                else{
                                    methods.rpLightboxMedia();
                                }
                            }
                        }
                    },
                    initRPScroll:function(){// Init Resize & Positioning
                        if (ResponsiveEnabled == 'true'){   
                            methods.rpResponsive();    
                            methods.rpContainer();
                            methods.rpBackground();

                            if (itemLoaded){
                                if (Media[currentItem-1] == ''){
                                    methods.rpLightboxImage();
                                }
                                else{
                                    methods.rpLightboxMedia();
                                }
                            }
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

                    initContainer:function(){// Init Container
                        $('.DOP_WallGridGallery_Container', Container).css('display', 'block');
                        
                        if (Height == 0){
                            $('.DOP_WallGridGallery_Container', Container).css('overflow', 'visible');
                        }
                        methods.rpContainer();
                    },
                    rpContainer:function(){// Resize & Position Container
                        $('.DOP_WallGridGallery_Container', Container).width(Width);

                        if (Height != 0){
                            $('.DOP_WallGridGallery_Container', Container).height(Height);
                        }
                        else{
                            $('.DOP_WallGridGallery_Container', Container).css('height', 'auto');
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).css('height', 'auto');                            
                        }
                    },

                    initBackground:function(){// Init Background
                        $('.DOP_WallGridGallery_Background', Container).css('background-color', '#'+BgColor);
                        $('.DOP_WallGridGallery_Background', Container).css('opacity', parseInt(BgAlpha)/100);

                        methods.rpBackground();
                    },
                    rpBackground:function(){// Resize & Position Background
                        $('.DOP_WallGridGallery_Background', Container).width(Width);
                        
                        if (Height != 0){
                            $('.DOP_WallGridGallery_Background', Container).height(Height);
                        }
                        else{                            
                            $('.DOP_WallGridGallery_Background', Container).height($('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height());
                        }
                    },

                    initThumbnails:function(){//Init Thumbnails
                        if (Height == 0){
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).css({'overflow': 'visible',
                                                                                        'position': 'relative'});
                        }
                        
                        for (var i=1; i<=noItems; i++){
                            methods.loadThumb(i);
                        }
                        
                        if (Height != 0){
                            if (prototypes.isTouchDevice()){
                                prototypes.touchNavigation($('.DOP_WallGridGallery_ThumbnailsWrapper', Container), $('.DOP_WallGridGallery_Thumbnails', Container));
                            }
                            else if (ThumbnailsNavigation == 'mouse'){
                                $('.DOP_WallGridGallery_Thumbnails', Container).css('position', 'absolute');
                                methods.moveThumbnails();
                            }
                            else if (ThumbnailsNavigation == 'scroll'){
                                methods.initThumbnailsScroll();
                            }
                        }
                        
                        methods.rpThumbnails();
                    },
                    loadThumb:function(no){// Load a thumbnail
                        methods.initThumb(no);
                        var img = new Image();

                        $(img).load(function(){
                            $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no, Container).html(this);
                            $('.DOP_WallGridGallery_Thumb img', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no, Container).attr('alt', CaptionTitle[no-1]);
                            
                            var hiddenBustedItems = prototypes.doHideBuster($(Container));
                            ThumbsWidth[no-1] = $(this).width();
                            ThumbsHeight[no-1] = $(this).height();
                            prototypes.undoHideBuster(hiddenBustedItems);
                            
                            methods.loadCompleteThumb(no);
                        }).attr('src', Thumbs[no-1]);
                    },
                    initThumb:function(no){// Init thumbnail before loading
                        var ThumbHTML = new Array(), 
                        labelHeight = ThumbnailsInfo == 'label' ? $('.DOP_WallGridGallery_ThumbLabel', Container).height()+parseFloat($('.DOP_WallGridGallery_ThumbLabel', Container).css('padding-top'))+parseFloat($('.DOP_WallGridGallery_ThumbLabel', Container).css('padding-bottom')):0;
                        
                        ThumbHTML.push('<div class="DOP_WallGridGallery_ThumbContainer" id="DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+'">');
                        
                        if (LabelPosition == 'top' && ThumbnailsInfo == 'label'){
                            if (CaptionTitle[no-1] != ''){
                                ThumbHTML.push('   <div class="DOP_WallGridGallery_ThumbLabel">'+CaptionTitle[no-1]+'</div>');
                            }
                            else{
                                ThumbHTML.push('   <div class="DOP_WallGridGallery_ThumbLabel">&nbsp;</div>');
                            }                                                 
                        }
                        
                        ThumbHTML.push('   <div class="DOP_WallGridGallery_ThumbIcons">');
                        
                        if (Links[no-1] != ''){
                            ThumbHTML.push('       <div class="DOP_WallGridGallery_ThumbIconLink">');
                            ThumbHTML.push('           <div class="glyph icon-25"></div>');
                            ThumbHTML.push('           <div class="glyph-hover icon-25"></div>');
                            ThumbHTML.push('       </div>');
                        }
                        ThumbHTML.push('       <div class="DOP_WallGridGallery_ThumbIconMedia">');
                        ThumbHTML.push('           <div class="glyph icon-305"></div>');
                        ThumbHTML.push('           <div class="glyph-hover icon-305"></div>');
                        ThumbHTML.push('       </div>');
                        ThumbHTML.push('       <br class="DOP_WallGridGallery_Clear" />');
                        ThumbHTML.push('   </div>');
                        ThumbHTML.push('   <div class="DOP_WallGridGallery_Thumb"></div>');
                        
                        if (LabelPosition == 'bottom' && ThumbnailsInfo == 'label'){
                            if (CaptionTitle[no-1] != ''){
                                ThumbHTML.push('   <div class="DOP_WallGridGallery_ThumbLabel">'+CaptionTitle[no-1]+'</div>');
                            }
                            else{
                                ThumbHTML.push('   <div class="DOP_WallGridGallery_ThumbLabel">&nbsp;</div>');
                            }                    
                        }

                        if (no == noItems){
                            ThumbHTML.push('</div><br style="clear:both;" />');
                        }
                        else{
                            ThumbHTML.push('</div>');
                        }

                        $('.DOP_WallGridGallery_Thumbnails', Container).append(ThumbHTML.join(""));

                        if (!prototypes.isTouchDevice()){
                            $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('opacity', parseInt(ThumbnailAlpha)/100);
                        }
                        
                        ThumbsLoaded[no-1] = false;
                        
                        if (LabelPosition == 'top' && ThumbnailsInfo == 'label'){                            
                            $('.DOP_WallGridGallery_Thumb', Container).css('margin-top', ThumbnailPaddingTop+labelHeight);                  
                        }
                        else{
                            $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('margin-top', ThumbnailPaddingTop);
                        }
                        $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('margin-left', ThumbnailPaddingLeft);
                        $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('margin-bottom', ThumbnailPaddingBottom);
                        $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('margin-right', ThumbnailPaddingRight);

                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('background-color', '#'+ThumbnailBgColor);
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('border-width', ThumbnailBorderSize);
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('border-color', '#'+ThumbnailBorderColor);
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+' .DOP_WallGridGallery_ThumbIconLink .glyph-hover').css('color', '#'+ThumbnailIconsColor);
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+' .DOP_WallGridGallery_ThumbIconMedia .glyph-hover').css('color', '#'+ThumbnailIconsColor);

                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).addClass('DOP_WallGridGallery_ThumbLoader');
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+'.DOP_WallGridGallery_ThumbLoader').css('background-image', 'url('+ThumbnailLoader+')');
                        
                        if (ThumbnailsInfo == 'label'){
                            $('.DOP_WallGridGallery_ThumbLabel', Container).css('color', '#'+LabelTextColor);
                        }
                        
                        methods.rpThumbnails();
                    },
                    loadCompleteThumb:function(no){// Resize, Position & Edit a thumbnmail after loading
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+'.DOP_WallGridGallery_ThumbLoader').css('background-image', 'none');
                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).removeClass('DOP_WallGridGallery_ThumbLoader');
                        ThumbsLoaded[no-1] = true;
                        
                        methods.rpThumbnails();
                        
                        $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).css('opacity', 0);
                        $('.DOP_WallGridGallery_Thumb', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).stop(true, true).animate({'opacity':'1'}, 600);
                        
                        if (ThumbnailsInfo == 'label'){
                            $('.DOP_WallGridGallery_ThumbIcons', '#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).stop(true, true).animate({'opacity': 1}, 600);
                        }
                        
                        if (!prototypes.isTouchDevice()){
                            $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).hover(function(){
                                $(this).stop(true, true).animate({'opacity': ThumbnailAlphaHover/100}, 600);
                                $(this).css('background-color', '#'+ThumbnailBgColorHover);
                                $(this).css('border-color', '#'+ThumbnailBorderColorHover);
                                
                                if (ThumbnailsInfo == 'tooltip' && !prototypes.isTouchDevice()){
                                    methods.showTooltip(no-1);
                                }
                                
                                if (ThumbnailsInfo == 'label'){
                                    $('.DOP_WallGridGallery_ThumbLabel', this).css('color', '#'+LabelTextColorHover);
                                }
                                
                                if (ThumbnailsInfo == 'none'){
                                    $('.DOP_WallGridGallery_ThumbIcons', this).stop(true, true).animate({'opacity': 1}, 600);
                                }
                            },
                            function(){
                                $(this).stop(true, true).animate({'opacity':parseInt(ThumbnailAlpha)/100}, 600);
                                $(this).css('background-color', '#'+ThumbnailBgColor);
                                $(this).css('border-color', '#'+ThumbnailBorderColor);
                                
                                if (ThumbnailsInfo == 'tooltip' && !prototypes.isTouchDevice()){
                                    $('.DOP_WallGridGallery_Tooltip', Container).css('display', 'none');
                                }
                                
                                if (ThumbnailsInfo == 'label'){
                                    $('.DOP_WallGridGallery_ThumbLabel', this).css('color', '#'+LabelTextColor);
                                }
                                
                                if (ThumbnailsInfo == 'none'){
                                    $('.DOP_WallGridGallery_ThumbIcons', this).stop(true, true).animate({'opacity': 0}, 600);
                                }
                            });
                        }
                        else{
                            if (ThumbnailsInfo == 'none'){
                                $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no).hover(function(){
                                    $('.DOP_WallGridGallery_ThumbIcons', this).stop(true, true).animate({'opacity': 1}, 600);
                                },
                                function(){
                                    $('.DOP_WallGridGallery_ThumbIcons', this).stop(true, true).animate({'opacity': 0}, 600);
                                });
                            }
                        }
                        
                        var openLighbox = true;
                        
                        if (Links[no-1] != ''){
                            $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+' .DOP_WallGridGallery_ThumbIconLink').click(function(){
                                openLighbox = false;
                                prototypes.openLink(Links[no-1], LinksTarget[no-1]);
                            });
                        }

                        $('#DOP_WallGridGallery_ThumbContainer_'+ID+'_'+no+' .DOP_WallGridGallery_ThumbIconMedia').click(function(){
                            if (openLighbox){
                                methods.showLightbox(no);
                            }
                            else{
                                openLighbox = true;
                            }
                        });
                    },
                    rpThumbnails:function(){// Resize & Position Thumbnails
                        var labelHeight = ThumbnailsInfo == 'label' ? $('.DOP_WallGridGallery_ThumbLabel', Container).height()+parseFloat($('.DOP_WallGridGallery_ThumbLabel', Container).css('padding-top'))+parseFloat($('.DOP_WallGridGallery_ThumbLabel', Container).css('padding-bottom')):0,
                        thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize,
                        no = 0,
                        hiddenBustedItems = prototypes.doHideBuster($(Container));

                        if (Height == 0){
                            NoColumns = parseInt((Width-ThumbnailsPaddingRight-ThumbnailsPaddingLeft+ThumbnailsSpacing)/(thumbnailWidth+ThumbnailsSpacing));
                            NoLines = parseInt(noItems/NoColumns);
                        
                            if (NoColumns == 0){
                                NoColumns = 1;
                            }

                            if (NoLines*NoColumns < noItems){
                                NoLines++;
                            }
                        }
                        else{
                            if (NoLines*NoColumns < noItems){
                                if (noItems%NoColumns != 0){
                                    NoLines = parseInt(noItems/NoColumns)+1;
                                }
                                else{
                                    NoLines = noItems/NoColumns;
                                }
                            }
                        }
                        
                        $('.DOP_WallGridGallery_ThumbContainer', Container).css({'height': ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+labelHeight,
                                                                                 'margin-top': 0,
                                                                                 'margin-right': 0,
                                                                                 'margin-bottom': 0,
                                                                                 'margin-left': 0,
                                                                                 'width': ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft});
                        $('.DOP_WallGridGallery_Thumb', Container).width(ThumbnailWidth);
                        $('.DOP_WallGridGallery_Thumb', Container).height(ThumbnailHeight);
                        $('.DOP_WallGridGallery_ThumbIconLink', Container).height($('.DOP_WallGridGallery_ThumbIconLink', Container).children().height());
                        $('.DOP_WallGridGallery_ThumbIconMedia', Container).height($('.DOP_WallGridGallery_ThumbIconMedia', Container).children().height());
                        
                        $('.DOP_WallGridGallery_ThumbIcons', Container).each(function(){
                            $(this).css({'margin-left': (ThumbnailWidth-$(this).width())/2,
                                         'margin-top': ThumbnailsInfo == 'none' ? (ThumbnailHeight-$(this).height())/2:ThumbnailHeight-$(this).height()/2});
                            
                        });
                        
                        $('.DOP_WallGridGallery_ThumbContainer', Container).each(function(){
                            no++;

                            if (no > NoColumns){
                                $(this).css('margin-top', ThumbnailsSpacing);
                            }

                            if (no%NoColumns != 1 && NoColumns != 1){
                                $(this).css('margin-left', ThumbnailsSpacing);
                            }

                            if (no <= NoColumns){
                                $(this).css('margin-top', ThumbnailsPaddingTop);
                            }

                            if (no%NoColumns == 0 && NoColumns != 1){
                                $(this).css('margin-right', ThumbnailsPaddingRight);
                            }

                            if (no > NoColumns*(NoLines-1)){
                                $(this).css('margin-bottom', ThumbnailsPaddingBottom);
                            }

                            if (no%NoColumns == 1 && NoColumns != 1){
                                $(this).css('margin-left', ThumbnailsPaddingLeft);
                            }          

                            if (ThumbsLoaded[no-1]){
                                if ($('.DOP_WallGridGallery_Thumb img', this).width() == 0){
                                    prototypes.resizeItem2($('.DOP_WallGridGallery_Thumb', this), $('.DOP_WallGridGallery_Thumb img', this), ThumbnailWidth, ThumbnailHeight, $('.DOP_WallGridGallery_Thumb', this).width(), $('.DOP_WallGridGallery_Thumb', this).height(), 'center');
                                }
                                else{
                                    prototypes.resizeItem2($('.DOP_WallGridGallery_Thumb', this), $('.DOP_WallGridGallery_Thumb img', this), ThumbnailWidth, ThumbnailHeight, ThumbsWidth[no-1], ThumbsHeight[no-1], 'center');
                                }
                                
                                if (ThumbsFirstPosX[no-1] == undefined){
                                    ThumbsFirstPosX[no-1] = parseInt($('.DOP_WallGridGallery_Thumb img', this).css('margin-left'));
                                }
                                else{
                                    if (Math.abs(ThumbsFirstPosX[no-1]-parseInt($('.DOP_WallGridGallery_Thumb img', this).css('margin-left'))) < 5){
                                        $('.DOP_WallGridGallery_Thumb img', this).css('margin-left', ThumbsFirstPosX[no-1]);
                                    }
                                }
                                
                                if (ThumbsFirstPosY[no-1] == undefined){
                                    ThumbsFirstPosY[no-1] = parseInt($('.DOP_WallGridGallery_Thumb img', this).css('margin-top'));
                                }
                                else{
                                    if (Math.abs(ThumbsFirstPosY[no-1]-parseInt($('.DOP_WallGridGallery_Thumb img', this).css('margin-top'))) < 5){
                                        $('.DOP_WallGridGallery_Thumb img', this).css('margin-top', ThumbsFirstPosY[no-1]);
                                    }
                                }
                            }
                        });
                        
                        $('.DOP_WallGridGallery_Thumbnails', Container).width(ThumbnailsPaddingRight+ThumbnailsPaddingLeft+thumbnailWidth*NoColumns+(NoColumns-1)*ThumbnailsSpacing);

                        if ($('.DOP_WallGridGallery_Thumbnails', Container).width() <= $('.DOP_WallGridGallery_Container', Container).width()){
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width($('.DOP_WallGridGallery_Thumbnails', Container).width());
                        }
                        else{
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width($('.DOP_WallGridGallery_Container', Container).width());
                        }

                        if ($('.DOP_WallGridGallery_Thumbnails', Container).height() <= $('.DOP_WallGridGallery_Container', Container).height()){
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height($('.DOP_WallGridGallery_Thumbnails', Container).height());
                        }
                        else{
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height($('.DOP_WallGridGallery_Container', Container).height());
                        }
                        
                        prototypes.centerItem($('.DOP_WallGridGallery_Container', Container), $('.DOP_WallGridGallery_ThumbnailsWrapper', Container), $('.DOP_WallGridGallery_Container', Container).width(), $('.DOP_WallGridGallery_Container', Container).height());
                                                
                        if (parseInt($('.DOP_WallGridGallery_Thumbnails', Container).css('margin-left')) < (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).width()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width())){
                            $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-left', (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).width()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width()));
                        }
                        if (parseInt($('.DOP_WallGridGallery_Thumbnails', Container).css('margin-left')) > 0){
                            $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-left', 0);
                        }
                        if (parseInt($('.DOP_WallGridGallery_Thumbnails', Container).css('margin-top')) < (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).height()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height())){
                            $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-top', (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).height()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height()));
                        }
                        if (parseInt($('.DOP_WallGridGallery_Thumbnails', Container).css('margin-top')) > 0){
                            $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-top', 0);
                        }
                        
                        $('.DOP_WallGridGallery_ThumbnailsWrapper .jspContainer', Container).width($('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width());
                        $('.jspDrag', '.DOP_WallGridGallery_ThumbnailsWrapper', Container).css('background', '#'+ThumbnailsScrollScrubColor);
                        $('.jspTrack', '.DOP_WallGridGallery_ThumbnailsWrapper', Container).css('background', '#'+ThumbnailsScrollBarColor);
                        
                        methods.rpContainer();
                        methods.rpBackground();
                        
                        prototypes.undoHideBuster(hiddenBustedItems);
                    },
                    moveThumbnails:function(){// Init thumbnails move
                        $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).mousemove(function(e){
                            var thumbnailWidth, thumbnailHeight, mousePosition, thumbnailsPosition;

                            if ($('.DOP_WallGridGallery_Thumbnails', Container).width() > $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width()){
                                thumbnailWidth = ThumbnailWidth+ThumbnailPaddingRight+ThumbnailPaddingLeft+2*ThumbnailBorderSize;
                                mousePosition = e.clientX-$(this).offset().left+parseInt($(this).css('margin-left'))+$(document).scrollLeft();
                                thumbnailsPosition = 0-(mousePosition-thumbnailWidth)*($('.DOP_WallGridGallery_Thumbnails', Container).width()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width())/($('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width()-2*thumbnailWidth);
                                if (thumbnailsPosition < (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).width()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width())){
                                    thumbnailsPosition = (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).width()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).width());
                                }
                                if (thumbnailsPosition > 0){
                                    thumbnailsPosition = 0;
                                }
                                $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-left', thumbnailsPosition);
                            }

                            if ($('.DOP_WallGridGallery_Thumbnails', Container).height() > $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height()){
                                thumbnailHeight = ThumbnailHeight+ThumbnailPaddingTop+ThumbnailPaddingBottom+2*ThumbnailBorderSize;
                                mousePosition = e.clientY-$(this).offset().top+parseInt($(this).css('margin-top'))+$(document).scrollTop();
                                thumbnailsPosition = 0-(mousePosition-thumbnailHeight)*($('.DOP_WallGridGallery_Thumbnails', Container).height()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height())/($('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height()-2*thumbnailHeight);
                                if (thumbnailsPosition < (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).height()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height())){
                                    thumbnailsPosition = (-1)*($('.DOP_WallGridGallery_Thumbnails', Container).height()-$('.DOP_WallGridGallery_ThumbnailsWrapper', Container).height());
                                }
                                if (thumbnailsPosition > 0){
                                    thumbnailsPosition = 0;
                                }
                                $('.DOP_WallGridGallery_Thumbnails', Container).css('margin-top', thumbnailsPosition);
                            }
                        });
                    },
                    initThumbnailsScroll:function(){//Init Thumbnails Scroll
                        setTimeout(function(){                            
                            $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).jScrollPane({autoReinitialise: true});
                            $('.jspDrag', '.DOP_WallGridGallery_ThumbnailsWrapper', Container).css('background', '#'+ThumbnailsScrollScrubColor);
                            $('.jspTrack', '.DOP_WallGridGallery_ThumbnailsWrapper', Container).css('background', '#'+ThumbnailsScrollBarColor);
                        }, 10);
                    },

                    initLightbox:function(){// Init Lightbox
                        startGalleryID = prototypes.$_GET('dop_wall_grid_gallery_id') != undefined ? parseInt(prototypes.$_GET('dop_wall_grid_gallery_id')):0;
                        startWith = prototypes.$_GET('dop_wall_grid_gallery_share') != undefined && startGalleryID == ID ? parseInt(prototypes.$_GET('dop_wall_grid_gallery_share')):0;
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').css({'background-color': '#'+LightboxWindowColor,
                                                                                                                  'opacity': LightboxWindowAlpha/100});
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxBg').css({'background-color': '#'+LightboxBgColor,
                                                                                                              'opacity': LightboxBgAlpha/100});
                                                                                             
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').hover(function(){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').stop(true, true).animate({'opacity': 1}, LightboxNavigationDisplayTime);
                        }, function(){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').stop(true, true).animate({'opacity': 0}, LightboxNavigationDisplayTime);
                        });

                        if (!prototypes.isTouchDevice()){                        
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_PrevBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_NextBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_CloseBtn').hover(function(){
                                $('.normal', this).css('display', 'none');
                                $('.hover', this).css('display', 'block');
                            }, function(){
                                $('.normal', this).css('display', 'block');
                                $('.hover', this).css('display', 'none');                            
                            });
                        }
                        else{
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').css('opacity', 1);
                            methods.lightboxNavigationSwipe();
                        }
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_PrevBtn').click(function(){
                            methods.previousLightbox();
                        });
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_NextBtn').click(function(){
                            methods.nextLightbox();
                        });
                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxSocialShare').hover(function(){
                            setTimeout(function(){                                
                                $('#at15s').css('position', 'fixed');
                                
                                $('#at15s').hover(function(){
                                    $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').stop(true, true).animate({'opacity': 1}, 0);  
                                }, function(){
                                });
                            }, 10);
                        }, function(){});
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation_CloseBtn').click(function(){
                           methods.hideLightbox();                           
                        });
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').click(function(){
                           methods.hideLightbox();                           
                        });
                        
                        $(document).keydown(function(e){
                            if (itemLoaded){
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
                        
                        if (startGalleryID == ID){
                            var href = window.location.href,
                            variables = 'dop_wall_grid_gallery_id='+startGalleryID+'&dop_wall_grid_gallery_share='+startWith;

                            if (href.indexOf('?'+variables) != -1){
                                variables = '?'+variables;
                            }
                            else{
                                variables = '&'+variables;
                            }
                                
                            window.location = '#DOPWallGridGallery'+ID;
                            
                            try{
                                window.history.pushState({'html':'', 'pageTitle':document.title}, '', href.split(variables)[0]);
                            }catch(e){
                                //console.log(e);
                            }
                        }
                        
                        if (startWith != 0){
                            methods.showLightbox(startWith);
                            startWith = 0;
                        }
                    },
                    showLightbox:function(no){// Show Lightbox
                        var documentW, documentH, windowW, windowH;
                        
                        if (LightboxPosition == 'document'){
                            documentW = $(document).width(); 
                            documentH = $(document).height();
                            windowW = $(window).width();
                            windowH = $(window).height();
                        }
                        else{                            
                            documentW = Width; 
                            documentH = Height;
                            windowW = Width;
                            windowH = Height;
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('position', 'absolute');
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('position', 'absolute');
                        }
                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).height(documentH);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').height(documentH);
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').height())/2,
                                                                                                                  'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').width())/2});
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'none');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'none');
                        
                        $('#panel').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#content-wrapper').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#gotop').animate({'opacity': 0}, LightboxDisplayTime);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).fadeIn(LightboxDisplayTime, function(){                        
                            if (Media[no-1] != ''){
                                methods.loadLightboxMedia(no);      
                            }
                            else{
                                methods.loadLightboxImage(no);
                            }
                        }); 
                    },
                    hideLightbox:function(){// Hide Lightbox
                        if (itemLoaded){
                            $('#panel').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#content-wrapper').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#gotop').animate({'opacity': 1}, LightboxDisplayTime);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID).fadeOut(LightboxDisplayTime, function(){
                                currentItem = 0;
                                itemLoaded = false;
                                clearInterval(socialShareInterval);
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('opacity', 0);
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').html('');
                            });      
                        }
                    },
                    loadLightboxImage:function(no){// Load Lightbox Image
                        var img = new Image();
                                                        
                        currentItem = no;
                        $('#DOP_WallGridGallery_ItemCount_'+ID).html(currentItem);
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'block');
                                                
                        $(img).load(function(){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'none');
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').html(this);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox img').attr('alt', CaptionTitle[no-1]);
                            
                            if (SocialShareEnabled == 'true'){
                                methods.showSocialShare();
                            }
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                            ImageWidth = $(this).width();
                            ImageHeight = $(this).height();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'none');
                            
                            itemLoaded = true;
                            methods.showCaption(no);
                            methods.rpLightboxImage();
                            
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').stop(true, true).animate({'opacity': 1}, LightboxDisplayTime, function(){
                                if (prototypes.isIEBrowser() && CaptionText[no-1] != ''){
                                    methods.rpLightboxImage();
                                }
                            });
                        }).attr('src', Images[no-1]);
                    },
                    loadLightboxMedia:function(no){// Load Lightbox Media                          
                        currentItem = no;
                        $('#DOP_WallGridGallery_ItemCount_'+ID).html(currentItem);
                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'none');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').html(Media[no-1]);
                        
                        if (SocialShareEnabled == 'true'){
                            methods.showSocialShare();
                        }
                        
                        var iframeSRC =  $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().attr('src');
                        
                        if (iframeSRC != null){
                            if (iframeSRC.indexOf('?') != -1){
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().attr('src', iframeSRC+'&wmode=transparent');
                            }
                            else{
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().attr('src', iframeSRC+'?wmode=transparent');                                
                            }
                        }
                        
                        if ($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().prop("tagName").toUpperCase() == 'IFRAME'){
                            ImageWidth = parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().attr('width'));
                            ImageHeight = parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().attr('height'));
                        }
                        else{
                            ImageWidth = 0;
                            ImageHeight = 0;
                        }

                        itemLoaded = true;
                        methods.showCaption(no);
                        methods.rpLightboxMedia();

                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').stop(true, true).animate({'opacity': 1}, LightboxDisplayTime);
                    },
                    previousLightbox:function(){
                        var previousItem = currentItem-1;
                            
                        if (currentItem == 1){
                            previousItem = noItems;
                        }
                        
//                        if (Links[previousItem-1] == ''){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').stop(true, true).animate({'opacity': 0}, LightboxDisplayTime, function(){
                                if (Media[previousItem-1] != ''){
                                    methods.loadLightboxMedia(previousItem);
                                }
                                else{
                                    methods.loadLightboxImage(previousItem);
                                }
                            });                        
//                        }
//                        else{
//                            currentItem = previousItem;
//                            methods.previousLightbox();
//                        }
                    },
                    nextLightbox:function(){
                        var nextItem = currentItem+1;
                            
                        if (currentItem == noItems){
                            nextItem = 1;
                        }
                            
//                        if (Links[nextItem-1] == ''){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').stop(true, true).animate({'opacity': 0}, LightboxDisplayTime, function(){
                                if (Media[nextItem-1] != ''){
                                    methods.loadLightboxMedia(nextItem);
                                }
                                else{
                                    methods.loadLightboxImage(nextItem);
                                }
                            });  
//                        }
//                        else{
//                            currentItem = nextItem;
//                            methods.nextLightbox();
//                        }                                              
                    },
                    rpLightboxImage:function(){// Resize & Position Lightbox Image
                        var documentW, documentH, windowW, windowH, maxWidth, maxHeight, currW, currH;
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'none');
                        
                        if (LightboxPosition == 'document'){
                            documentW = $(document).width(); 
                            documentH = $(document).height();
                            windowW = $(window).width();
                            windowH = $(window).height();
                        }
                        else{      
                            documentW = $(Container).width(); 
                            documentH = $(Container).height();
                            windowW = $(Container).width();
                            windowH = $(Container).height();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('position', 'absolute');
                        }
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                        maxWidth = windowW-($(window).width() <= 640 ? 1:LightboxMarginRight)-($(window).width() <= 640 ? 1:LightboxMarginLeft)-LightboxPaddingRight-LightboxPaddingLeft;
                        maxHeight = windowH-($(window).width() <= 640 ? 1:LightboxMarginTop)-($(window).width() <= 640 ? 1:LightboxMarginBottom)-LightboxPaddingTop-LightboxPaddingBottom-CaptionHeight;
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).height(documentH);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').height(documentH);
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').height())/2,
                                                                                                                  'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').width())/2});
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'none');
                        
                        if (itemLoaded){  
                            if (ImageWidth <= maxWidth && ImageHeight <= maxHeight){
                                currW = ImageWidth;
                                currH = ImageHeight;
                            }
                            else{
                                currH = maxHeight;
                                currW = (ImageWidth*maxHeight)/ImageHeight;

                                if (currW > maxWidth){
                                    currW = maxWidth;
                                    currH = (ImageHeight*maxWidth)/ImageWidth;
                                }
                            }

                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox img').width(currW);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox img').height(currH);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox img').css({'margin-top': LightboxPaddingTop,
                                                                                                                    'margin-left': LightboxPaddingLeft});
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').css({'height': $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().height(),
                                                                                                                'width': $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().width()});                                                                                        
                            methods.rpCaption();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height(currH+LightboxPaddingTop+LightboxPaddingBottom+$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').height());
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxBg').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxBg').height(currH+LightboxPaddingTop+LightboxPaddingBottom+$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').height());
                            
                            if (LightboxPosition == 'document'){
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height())/2+$(window).scrollTop(),
                                                                                                                             'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width())/2+$(window).scrollLeft()});
                            }
                            else{
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height())/2,
                                                                                                                             'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width())/2});
                            }
                            methods.rpLightboxNavigation();
                        }
                    },
                    rpLightboxMedia:function(){// Resize & Position Lightbox Media
                        var documentW, documentH, windowW, windowH, maxWidth, maxHeight, currW, currH;
                                                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'none');
                        
                        if (LightboxPosition == 'document'){
                            documentW = $(document).width(); 
                            documentH = $(document).height();
                            windowW = $(window).width();
                            windowH = $(window).height();
                        }
                        else{                  
                            documentW = $(Container).width(); 
                            documentH = $(Container).height();
                            windowW = $(Container).width();
                            windowH = $(Container).height();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('position', 'absolute');
                        }
                                                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                        maxWidth = windowW-($(window).width() <= 640 ? 1:LightboxMarginRight)-($(window).width() <= 640 ? 1:LightboxMarginLeft)-LightboxPaddingRight-LightboxPaddingLeft;
                        maxHeight = windowH-($(window).width() <= 640 ? 1:LightboxMarginTop)-($(window).width() <= 640 ? 1:LightboxMarginBottom)-LightboxPaddingTop-LightboxPaddingBottom-CaptionHeight;
                                                                                                                                                
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).height(documentH);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').width(documentW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxWindow').height(documentH);
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID).css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'block');
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').height())/2,
                                                                                                                  'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').width())/2});
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxLoader').css('display', 'none');
                                                
                        if (ImageWidth <= maxWidth && ImageHeight <= maxHeight){
                            currW = ImageWidth;
                            currH = ImageHeight;
                            
                            if (ImageWidth == 0 && ImageHeight == 0){
                                currW = $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().width();
                                currH = $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().height();
                            }
                        }
                        else{
                            currH = maxHeight;
                            currW = (ImageWidth*maxHeight)/ImageHeight;
                        
                            if (currW > maxWidth){
                                currW = maxWidth;
                                currH = (ImageHeight*maxWidth)/ImageWidth;
                            }
                        }
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().width(currW);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().height(currH);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().css({'margin-top': LightboxPaddingTop,
                                                                                                                       'margin-left': LightboxPaddingLeft});
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').css({'height': currH,
                                                                                                            'width': currW});
                        
                        methods.rpCaption();
                                                                                                                  
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height(currH+LightboxPaddingTop+LightboxPaddingBottom+$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').height());
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxBg').width(currW+LightboxPaddingRight+LightboxPaddingLeft);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxBg').height(currH+LightboxPaddingTop+LightboxPaddingBottom+$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').height());
                        
                        if (LightboxPosition == 'document'){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height())/2+$(window).scrollTop(),
                                                                                                                         'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width())/2+$(window).scrollLeft()});
                        }
                        else{
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-top': (windowH-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').height())/2,
                                                                                                                         'margin-left': (windowW-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width())/2});
                        }                                                                                                                                                                                                                                             
                        methods.rpLightboxNavigation();
                    },
                    rpLightboxNavigation:function(){// Resize & Position Lightbox Navigation
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigationButtons').css({'margin-top': ($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').height()-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigationButtons').children().height())/2+LightboxPaddingTop,
                                                                                                                             'margin-left': LightboxPaddingLeft,
                                                                                                                             'width': $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').width()});
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigationExtraButtons').css({'margin-top': LightboxPaddingTop,
                                                                                                                                  'margin-left': LightboxPaddingLeft,
                                                                                                                                  'width': $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').width()});
                    },
                    lightboxNavigationSwipe:function(){
                        var prev, curr, touch, initial, positionX;

                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').bind('touchstart', function(e){
                            touch = e.originalEvent.touches[0];
                            prev = touch.clientX;
                            initial = parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left')); 
                        });

                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').bind('touchmove', function(e){
                            e.preventDefault();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').css('opacity', 0);

                            touch = e.originalEvent.touches[0],
                            curr = touch.clientX,
                            positionX = curr>prev ? parseInt($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left'))+(curr-prev):parseInt($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left'))-(prev-curr);

                            prev = curr;
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left', positionX);
                        });

                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').bind('touchend', function(e){
                            if (!prototypes.isChromeMobileBrowser()){
                                e.preventDefault();
                            }
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxNavigation').css('opacity', 1);
                                
                            if (parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left')) < 0){
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-left': initial, 'opacity': 0});
                                methods.nextLightbox();
                            }
                            else if (parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left'))+$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').width() > $(window).width()){
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css({'margin-left': initial, 'opacity': 0});
                                methods.previousLightbox();
                            }
                            else{
                                $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxContainer').css('margin-left', initial);
                            }
                        });
                    },     

                    initCaption:function(){// Init Caption
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').css({'margin-left': LightboxPaddingLeft,
                                                                                                           'bottom': LightboxPaddingBottom});
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTitle').css('color', '#'+CaptionTitleColor);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionText').css('color', '#'+CaptionTextColor);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').jScrollPane();
                    },
                    showCaption:function(no){// Show Caption
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTitle .title').html(CaptionTitle[no-1]);
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionText').html(CaptionText[no-1]);
                            
                        if (CaptionText[no-1] == ''){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').css('display', 'none');
                        }
                        else{
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').css('display', 'block');
                        }
                    },  
                    rpCaption:function(){// Resize & Position Caption
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').height($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionText').height());
                        var textHeight = CaptionHeight-$('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTitle').height()-parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTitle').css('margin-top'))-parseFloat($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').css('margin-top'));
                        
                        $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Caption').width($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_Lightbox').children().width());
                        
                        if ($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').height() > textHeight){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').height(textHeight);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').jScrollPane();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .jspDrag').css('background-color', '#'+CaptionScrollScrubColor);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .jspTrack').css('background-color', '#'+CaptionScrollBgColor);
                        }
                        
                        setTimeout(function(){
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_CaptionTextContainer').jScrollPane();
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .jspDrag').css('background-color', '#'+CaptionScrollScrubColor);
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .jspTrack').css('background-color', '#'+CaptionScrollBgColor);
                        }, 100);
                    },          
                                        
                    initSocialShare:function(){
                        var HTML = new Array();
                        
                        if ($('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxSocialShare').html() == ''){
                            HTML.push('       <div class="addthis_toolbox addthis_default_style">');
                            HTML.push('            <a class="addthis_button" addthis:url="" addthis:title="">');
                            HTML.push('                <img src="'+SocialShareLightbox+'" alt="" />');
                            HTML.push('            </a>');
                            HTML.push('       </div>');
                        
                            $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxSocialShare').html(HTML.join(''));
                        }
                    },
                    showSocialShare:function(){
                        var URL = window.location.href+(window.location.href.indexOf('?') != -1 ? '&':'?')+'dop_wall_grid_gallery_id='+ID+'&dop_wall_grid_gallery_share='+currentItem;
                        
                        if (window.addthis == undefined){
                            $.getScript( 'http://s7.addthis.com/js/250/addthis_widget.js' , function(){
                                if (window.addthis){ 
                                    window.addthis.ost = 0; 
                                    window.addthis.init();
                                    
                                    setTimeout(function(){
                                        window.addthis.update('share', 'url', URL);
                                        window.addthis.update('share', 'title', CaptionTitle[currentItem-1]);
                                    }, 100);

                                    $('#at15s').css('top', parseFloat($('#at15s').css('top'))-$(window).scrollTop());
                                } 
                            }); 
                        }
                        else{                                    
                            setTimeout(function(){
                                window.addthis.update('share', 'url', URL);
                                window.addthis.update('share', 'title', CaptionTitle[currentItem-1]);
                            }, 100);
                        }
                        
                        clearInterval(socialShareInterval);
                        socialShareInterval = setInterval(methods.rpSocialShare, 100);
                    },
                    rpSocialShare:function(){
                        $('#at15s').css('top', $('#DOP_WallGridGallery_LightboxWrapper_'+ID+' .DOP_WallGridGallery_LightboxSocialShare').offset().top-$(window).scrollTop());
                    }, 
                    
                    initTooltip:function(){// Init Tooltip
                        var mousePositionX, mousePositionY, scrolledX = null, scrolledY = null;
                        
                        $('.DOP_WallGridGallery_ThumbnailsWrapper', Container).bind('mousemove', function(e){
                            mousePositionX = e.clientX-$(this).offset().left+parseInt($(this).css('margin-left'))+$(document).scrollLeft();
                            mousePositionY = e.clientY-$(this).offset().top+parseInt($(this).css('margin-top'))+$(document).scrollTop();
                            
                            $('.DOP_WallGridGallery_Tooltip', Container).css('margin-left', mousePositionX-10);
                            $('.DOP_WallGridGallery_Tooltip', Container).css('top', mousePositionY-$('.DOP_WallGridGallery_Tooltip', Container).height()-15);
                        });
                        
                        $(window).scroll(function(){
                            if(scrolledX != $(document).scrollLeft()){
                                mousePositionX -= scrolledX;
                                scrolledX = $(document).scrollLeft();
                                mousePositionX += scrolledX;
                            }
                            
                            if(scrolledY != $(document).scrollTop()){
                                mousePositionY -= scrolledY;
                                scrolledY = $(document).scrollTop();
                                mousePositionY += scrolledY;
                            }
                            
                            $('.DOP_WallGridGallery_Tooltip', Container).css('margin-left', mousePositionX-10);
                            $('.DOP_WallGridGallery_Tooltip', Container).css('top', mousePositionY-$('.DOP_WallGridGallery_Tooltip', Container).height()-15);
                        });
                    },
                    showTooltip:function(no){// Resize, Position & Display the Tooltip
                        var HTML = new Array();
                        HTML.push(CaptionTitle[no]);
                        HTML.push('<div class="DOP_WallGridGallery_Tooltip_ArrowBorder"></div>');
                        HTML.push('<div class="DOP_WallGridGallery_Tooltip_Arrow"></div>');
                        $('.DOP_WallGridGallery_Tooltip', Container).html(HTML.join(""));

                        if (TooltipBgColor != 'css'){
                            $('.DOP_WallGridGallery_Tooltip', Container).css('background-color', '#'+TooltipBgColor);
                            $('.DOP_WallGridGallery_Tooltip_Arrow', Container).css('border-top-color', '#'+TooltipBgColor);
                        }
                        if (TooltipStrokeColor != 'css'){
                            $('.DOP_WallGridGallery_Tooltip', Container).css('border-color', '#'+TooltipStrokeColor);
                            $('.DOP_WallGridGallery_Tooltip_ArrowBorder', Container).css('border-top-color', '#'+TooltipStrokeColor);
                        }
                        if (TooltipTextColor != 'css'){
                            $('.DOP_WallGridGallery_Tooltip', Container).css('color', '#'+TooltipTextColor);
                        }
                        if (CaptionTitle[no] != ''){
                            $('.DOP_WallGridGallery_Tooltip', Container).css('display', 'block');
                        }
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