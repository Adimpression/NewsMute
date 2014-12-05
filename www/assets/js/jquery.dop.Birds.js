
/*
* Title                   : Wall/Grid Gallery (WordPress Plugin)
* Version                 : 1.5
* File                    : jquery.dop.WallGridGallery.js
* File Version            : 1.5
* Created / Last Modified : 11 October 2012
* Author                  : Marius-Cristian Donea
* Copyright               : © 2012 Marius-Cristian Donea
* Website                 : http://www.mariuscristiandonea.com
* Description             : Wall/Grid jQuery plugin.
*/

(function($){
    $.fn.DOPBirds = function(options){
        var Data = {'NoBirds': 72,
                    'Width': $(window).width(),
                    'Height': $(window).height(),
                    'FlyFrom': 'top-right'},

        Container = this,
        
        NoBirds = 72,
        Width = $(window).width(),
        Height = $(window).height(),
        FlyFrom = 'top-right',
        
        birdsInterval,
        birdsCanvas,
        birdsCanvasNoThis,
        
        methods = {
                    init:function( ){// Init Plugin.
                        return this.each(function(){                            
                            if (options){
                                $.extend(Data, options);
                            }
                            
                            if (!prototypes.isIE8Browser()){
                                birdsCanvasNo++;
                                birdsCanvasNoThis = birdsCanvasNo;
                                NoBirds = Data['NoBirds'];
                                Width = Data['Width'];
                                Height = Data['Height'];
                                FlyFrom = Data['FlyFrom'];

                                methods.Bird.prototype = new THREE.Geometry();
                                methods.Bird.prototype.constructor = methods.Bird;

                                if (!prototypes.isTouchDevice()){
                                    methods.initBirds();
                                }
                                $(window).bind('resize.DOPBirds', methods.initRP);
                                $(window).bind('scroll.DOPBirds', methods.initRP);
                            }
                        });
                    },
                    initBirds:function(){
                        clearInterval(birdsInterval);
                        methods.initRP();
                        $(Container).html('');
                        birdsCanvas = new methods.canvas();
                        birdsInterval = setInterval(methods.loop, 100/6);
                    },
                    initRP:function(){
                        $(Container).width(Width);
                        $(Container).height(Height);
                    },
                    loop:function(){
                        if (birdsCanvasNoThis != birdsCanvasNo){
                            clearInterval(birdsInterval);
                        }
                        birdsCanvas.update();
                    },
                    canvas:function(){
                        var camera, scene, renderer,
                        birds, bird, mouse,
                        boid, boids, interval,
                        xDecalation, yDecalation;
                        
                        switch (FlyFrom){
                            case 'top':
                                xDecalation = -Width/5;
                                yDecalation = 0;
                                break;
                            case 'top-right':
                                xDecalation = Width/4*3;
                                yDecalation = 0;
                                break; 
                            case 'right':
                                xDecalation = Width-150;
                                yDecalation = 0;
                                break; 
                            case 'bottom-right':
                                xDecalation = Width/4;
                                yDecalation = -Height;
                                break; 
                            case 'bottom':
                                xDecalation = -Width/10;
                                yDecalation = -Height;
                                break; 
                            case 'bottom-left':
                                xDecalation = -Width/2;
                                yDecalation = -Height;
                                break; 
                            case 'left':
                                xDecalation = -Width;
                                yDecalation = -Height/2;
                                break; 
                            case 'top-left':
                                xDecalation = -Width+150;
                                yDecalation = 0;
                                break; 
                            default:
                                xDecalation = Width/4*3;
                                yDecalation = 0;
                        }

                        init();

                        function init(){
                            mouse = new THREE.Vector3(0, Width, 0);
                            camera = new THREE.Camera(75, Width/Height, 1, 10000);
                            camera.position.z = 500;

                            scene = new THREE.Scene();

                            birds = [];
                            boids = [];

                            renderer = new THREE.CanvasRenderer();
                            renderer.domElement.style.position = 'absolute';
                            renderer.domElement.style.left = '0px';
                            renderer.domElement.style.top = '0px';
                            renderer.setSize(Width, Height);

                            $(Container).append(renderer.domElement);
                            document.addEventListener('mousemove', onDocumentMouseMove, false);

                            interval = setInterval(addBird, 100);
                        }

                        function addBird(){
                            boid = boids[boids.length] = new methods.Boid();
                            boid.position.x = Math.random()*100+xDecalation;
                            boid.position.y = Math.random()*Height+yDecalation;
                            boid.position.z = Math.random()*100;
                            
                            boid.velocity.x = Math.random()*2+1;
                            boid.velocity.y = Math.random()*2+1;
                            boid.velocity.z = Math.random()*2+1;

                            boid.setAvoidWalls(true);
                            boid.setWorldSize(Width, Height, 300);

                            bird = birds[birds.length] = new THREE.Mesh(new methods.Bird(), new THREE.MeshColorFillMaterial(0x000000));
                            bird.phase = Math.floor(Math.random()*62.83);
                            bird.position = boid.position;
                            bird.doubleSided = true;
                            scene.addObject(bird);

                            if (boids.length >= NoBirds){
                                clearInterval(interval);
                            }
                        }

                        function onDocumentMouseMove(event){
                            mouse.x = event.clientX-Width/2;
                            mouse.y = -event.clientY+Height/2;
                        }

                        this.update = function(){
                            var color;

                            for (var i=0, il=birds.length; i<il; i++){
                                boid = boids[i];
                                boid.run(boids);

                                mouse.z = boid.position.z;
                                boid.repulse(mouse);

                                bird = birds[i];

                                color = bird.material[0].color;
                                color.r = color.g = color.b = (500-bird.position.z)/1000;
                                color.updateStyleString();

                                bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
                                bird.rotation.z = Math.asin(boid.velocity.y/boid.velocity.length());

                                bird.phase += Math.max(0, bird.rotation.z-0.5)+0.1;
                                bird.geometry.vertices[5].position.y = bird.geometry.vertices[4].position.y = Math.sin(bird.phase%62.83)*5;
                            }

                            renderer.render(scene, camera);
                        }
                    },
                    Boid:function(){
                        var vector = new THREE.Vector3(),
                        _acceleration, _width, _height, _depth, _goal, _neighborhoodRadius = 100,
                        _maxSpeed = 3, _maxSteerForce = 0.1, _avoidWalls = false;

                        this.position = new THREE.Vector3();
                        this.velocity = new THREE.Vector3();
                        _acceleration = new THREE.Vector3();

                        this.setGoal = function(target){
                            _goal = target;
                        }

                        this.setAvoidWalls = function(value){
                            _avoidWalls = value;
                        }

                        this.setWorldSize = function(width, height, depth){
                            _width = width;
                            _height = height;
                            _depth = depth;
                        }

                        this.run = function(boids){
                            if (_avoidWalls){
                                vector.set(-_width, this.position.y, this.position.z);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);

                                vector.set(_width, this.position.y, this.position.z);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);

                                vector.set(this.position.x, -_height, this.position.z);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);

                                vector.set(this.position.x, _height, this.position.z);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);

                                vector.set(this.position.x, this.position.y, -_depth);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);

                                vector.set(this.position.x, this.position.y, _depth);
                                vector = this.avoid(vector);
                                vector.multiplyScalar(5);
                                _acceleration.addSelf(vector);
                            }

                            if (Math.random() > 0.5){
                                this.flock(boids);
                            }

                            this.move();
                        }

                        this.flock = function(boids){
                            if (_goal){
                                _acceleration.addSelf(this.reach(_goal, 0.005));
                            }

                            _acceleration.addSelf( this.alignment( boids ) );
                            _acceleration.addSelf( this.cohesion( boids ) );
                            _acceleration.addSelf( this.separation( boids ) );
                        }

                        this.move = function(){
                            this.velocity.addSelf(_acceleration);

                            var l = this.velocity.length();

                            if (l > _maxSpeed){
                                this.velocity.divideScalar(l/_maxSpeed);
                            }

                            this.position.addSelf(this.velocity);
                            _acceleration.set( 0, 0, 0 );
                        }

                        this.checkBounds = function(){
                            if (this.position.x > _width){
                                this.position.x = -_width;
                            }

                            if (this.position.x < -_width){
                                this.position.x = _width;
                            }

                            if (this.position.y > _height){
                                this.position.y = -_height;
                            }

                            if (this.position.y < -_height){
                                this.position.y = _height;
                            }

                            if (this.position.z > _depth){
                                this.position.z = -_depth;
                            }

                            if (this.position.z < -_depth){
                                this.position.z = _depth;
                            }
                        }

                        this.avoid = function(target){
                            var steer = new THREE.Vector3();

                            steer.copy(this.position);
                            steer.subSelf(target);
                            steer.multiplyScalar(1/this.position.distanceToSquared(target));

                            return steer;
                        }

                        this.repulse = function(target){
                            var d = this.position.distanceTo(target);

                            if (d < 150){
                                var steer = new THREE.Vector3();

                                steer.copy( this.position );
                                steer.subSelf( target );
                                steer.multiplyScalar( 0.5 / this.position.distanceTo(target));
                                _acceleration.addSelf( steer );
                            }
                        }

                        this.reach = function(target, amount){
                            var steer = new THREE.Vector3();

                            steer.copy( target );
                            steer.subSelf( this.position );
                            steer.multiplyScalar( amount );

                            return steer;
                        }

                        this.alignment = function(boids){
                            var boid, velSum = new THREE.Vector3(),
                            count = 0, distance;

                            for (var i=0, il=boids.length; i<il; i++){
                                if (Math.random() > 0.6){
                                    continue;
                                }

                                boid = boids[i];
                                distance = boid.position.distanceTo(this.position);

                                if (distance > 0 && distance <= _neighborhoodRadius){
                                    velSum.addSelf( boid.velocity );
                                    count++;
                                }
                            }

                            if (count > 0){
                                velSum.divideScalar(count);

                                var l = velSum.length();

                                if (l > _maxSteerForce){
                                    velSum.divideScalar(l/_maxSteerForce);
                                }
                            }

                            return velSum;
                        }

                        this.cohesion = function(boids){
                            var boid, distance,
                            posSum = new THREE.Vector3(),
                            steer = new THREE.Vector3(),
                            count = 0;

                            for (var i=0, il=boids.length; i<il; i++){
                                if ( Math.random() > 0.6 ){
                                    continue;
                                }

                                boid = boids[i];
                                distance = boid.position.distanceTo(this.position);

                                if (distance > 0 && distance <= _neighborhoodRadius){
                                    posSum.addSelf(boid.position);
                                    count++;
                                }
                            }

                            if (count > 0){
                                posSum.divideScalar(count);
                            }

                            steer.copy(posSum);
                            steer.subSelf(this.position);

                            var l = steer.length();

                            if (l > _maxSteerForce){
                                steer.divideScalar(l/_maxSteerForce);
                            }

                            return steer;
                        }

                        this.separation = function(boids){
                            var boid, distance,
                            posSum = new THREE.Vector3(),
                            repulse = new THREE.Vector3();

                            for (var i=0, il=boids.length; i<il; i++){
                                if (Math.random() > 0.6){
                                    continue;
                                }

                                boid = boids[i];
                                distance = boid.position.distanceTo(this.position);

                                if (distance > 0 && distance <= _neighborhoodRadius){
                                    repulse.copy(this.position)
                                    repulse.subSelf(boid.position);
                                    repulse.normalize();
                                    repulse.divideScalar(distance);
                                    posSum.addSelf(repulse);
                                }
                            }

                            return posSum;
                        }
                    },
                    Bird:function(){
                        var scope = this;

                        THREE.Geometry.call(this);

                        v(5, 0, 0);
                        v(-5, -2, 1);
                        v(-5, 0, 0);
                        v(-5, -2, -1);

                        v(0, 2, -12);
                        v(0, 2, 12);
                        v(2, 0, 0);
                        v(-3, 0, 0);

                        f3(0, 2, 1);
                        f3(4, 7, 6);
                        f3(5, 6, 7);

                        function v(x, y, z){
                            scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));
                        }

                        function f3(a, b, c){
                            scope.faces.push(new THREE.Face3(a, b, c));
                        }
                    }
                  },

        prototypes = {
                        resizeItem:function(parent, child, cw, ch, dw, dh, pos){// Resize & Position an Item (the item is 100% visible)
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
                        resizeItem2:function(parent, child, cw, ch, dw, dh, pos){// Resize & Position an Item (the item covers all the container)
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

                        topItem:function(parent, child, ch){// Position Item on Top
                            parent.height(ch);
                            child.css('margin-top', 0);
                        },
                        bottomItem:function(parent, child, ch){// Position Item on Bottom
                            parent.height(ch);
                            child.css('margin-top', ch-child.height());
                        },
                        leftItem:function(parent, child, cw){// Position Item on Left
                            parent.width(cw);
                            child.css('margin-left', 0);
                        },
                        rightItem:function(parent, child, cw){// Position Item on Right
                            parent.width(cw);
                            child.css('margin-left', parent.width()-child.width());
                        },
                        hCenterItem:function(parent, child, cw){// Position Item on Horizontal Center
                            parent.width(cw);
                            child.css('margin-left', (cw-child.width())/2);
                        },
                        vCenterItem:function(parent, child, ch){// Position Item on Vertical Center
                            parent.height(ch);
                            child.css('margin-top', (ch-child.height())/2);
                        },
                        centerItem:function(parent, child, cw, ch){// Position Item on Center
                            prototypes.hCenterItem(parent, child, cw);
                            prototypes.vCenterItem(parent, child, ch);
                        },
                        tlItem:function(parent, child, cw, ch){// Position Item on Top-Left
                            prototypes.topItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        tcItem:function(parent, child, cw, ch){// Position Item on Top-Center
                            prototypes.topItem(parent, child, ch);
                            prototypes.hCenterItem(parent, child, cw);
                        },
                        trItem:function(parent, child, cw, ch){// Position Item on Top-Right
                            prototypes.topItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        mlItem:function(parent, child, cw, ch){// Position Item on Middle-Left
                            prototypes.vCenterItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        mrItem:function(parent, child, cw, ch){// Position Item on Middle-Right
                            prototypes.vCenterItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        blItem:function(parent, child, cw, ch){// Position Item on Bottom-Left
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.leftItem(parent, child, cw);
                        },
                        bcItem:function(parent, child, cw, ch){// Position Item on Bottom-Center
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.hCenterItem(parent, child, cw);
                        },
                        brItem:function(parent, child, cw, ch){// Position Item on Bottom-Right
                            prototypes.bottomItem(parent, child, ch);
                            prototypes.rightItem(parent, child, cw);
                        },
                        
                        touchNavigation:function(parent, child){// One finger Navigation for touchscreen devices
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

			rgb2hex:function(rgb){
			    var hexDigits = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
    			
			    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

			    return (isNaN(rgb[1]) ? '00':hexDigits[(rgb[1]-rgb[1]%16)/16]+hexDigits[rgb[1]%16])+
           			   (isNaN(rgb[2]) ? '00':hexDigits[(rgb[2]-rgb[2]%16)/16]+hexDigits[rgb[2]%16])+
			           (isNaN(rgb[3]) ? '00':hexDigits[(rgb[3]-rgb[3]%16)/16]+hexDigits[rgb[3]%16]);
			},

                        dateDiference:function(date1, date2){
                            var time1 = date1.getTime(),
                            time2 = date2.getTime(),
                            diff = Math.abs(time1-time2),
                            one_day = 1000*60*60*24;
                            
                            return parseInt(diff/(one_day))+1;
                        },
                        noDays:function(date1, date2){
                            var time1 = date1.getTime(),
                            time2 = date2.getTime(),
                            diff = Math.abs(time1-time2),
                            one_day = 1000*60*60*24;
                            
                            return Math.round(diff/(one_day))+1;
                        },
                        timeLongItem:function(item){// Return month with 0 in front if smaller then 10.
                            if (item < 10){
                                return '0'+item;
                            }
                            else{
                                return item;
                            }
                        },
                        timeToAMPM:function(item){
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

                        stripslashes:function(str){
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
                        isTouchDevice:function(){// Detect Touchscreen devices
                            var os = navigator.platform;
                            
                            if (os.toLowerCase().indexOf('win') != -1){
                                return window.navigator.msMaxTouchPoints;
                            }
                            else {
                                return 'ontouchstart' in document;
                            }
                        },

                        openLink:function(url, target){// Open a link.
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

                        validateCharacters:function(str, allowedCharacters){
                            var characters = str.split(''), i;

                            for (i=0; i<characters.length; i++){
                                if (allowedCharacters.indexOf(characters[i]) == -1){
                                    return false;
                                }
                            }
                            return true;
                        },
                        cleanInput:function(input, allowedCharacters, firstNotAllowed, min){
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
                        validEmail:function(email){
                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            
                            if (filter.test(email)){
                                return true;
                            }
                            return false;
                        },
                        
                        $_GET:function(variable){ 
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
                        acaoBuster:function(dataURL){
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
                       
                        setCookie:function(c_name, value, expiredays){
                            var exdate = new Date();
                            exdate.setDate(exdate.getDate()+expiredays);

                            document.cookie = c_name+"="+escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toUTCString())+";javahere=yes;path=/";
                        },
                        readCookie:function(name){
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
                        deleteCookie:function(c_name, path, domain){
                            if (readCookie(c_name)){
                                document.cookie = c_name+"="+((path) ? ";path="+path:"")+((domain) ? ";domain="+domain:"")+";expires=Thu, 01-Jan-1970 00:00:01 GMT";
                            }
                        }
                    };

        return methods.init.apply(this);
    }
})(jQuery);