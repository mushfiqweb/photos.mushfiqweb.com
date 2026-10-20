var main=(function($){var _={settings:{preload:false,slideDuration:500,layoutDuration:750,thumbnailsPerRow:2,mainSide:'right'},$window:null,$body:null,$main:null,$thumbnails:null,$viewer:null,$toggle:null,$navNext:null,$navPrevious:null,slides:[],current:null,locked:false,keys:{27:function(){_.toggle();},38:function(){_.up();},40:function(){_.down();},32:function(){_.next();},39:function(){_.next();},37:function(){_.previous();}},initProperties:function(){_.$window=$(window);_.$body=$('body');_.$thumbnails=$('#thumbnails');_.$viewer=$('<div id="viewer">'+
'<div class="inner">'+
'<div class="nav-next"></div>'+
'<div class="nav-previous"></div>'+
'<div class="toggle"></div>'+
'</div>'+
'</div>').appendTo(_.$body);_.$navNext=_.$viewer.find('.nav-next');_.$navPrevious=_.$viewer.find('.nav-previous');_.$main=$('#main');$('<div class="toggle"></div>').appendTo(_.$main);_.$toggle=$('.toggle');if(skel.vars.IEVersion<9)
_.$window.on('resize',function(){window.setTimeout(function(){_.$viewer.css('width',_.$window.width()-_.$main.width());},100);}).trigger('resize');},initEvents:function(){_.$window.on('load',function(){_.$body.removeClass('is-loading-0');window.setTimeout(function(){_.$body.removeClass('is-loading-1');},100);window.setTimeout(function(){_.$body.removeClass('is-loading-2');},100+Math.max(_.settings.layoutDuration-150,0));});var resizeTimeout;_.$window.on('resize',function(){_.$body.addClass('is-loading-0');window.clearTimeout(resizeTimeout);resizeTimeout=window.setTimeout(function(){_.$body.removeClass('is-loading-0');},100);});_.$viewer.on('touchend',function(){if(skel.breakpoint('medium').active)
_.hide();});_.$viewer.on('touchstart',function(event){_.$viewer.touchPosX=event.originalEvent.touches[0].pageX;_.$viewer.touchPosY=event.originalEvent.touches[0].pageY;}).on('touchmove',function(event){if(_.$viewer.touchPosX===null||_.$viewer.touchPosY===null)
return;var diffX=_.$viewer.touchPosX-event.originalEvent.touches[0].pageX,diffY=_.$viewer.touchPosY-event.originalEvent.touches[0].pageY;boundary=20,delta=50;if((diffY<boundary&&diffY>(-1*boundary))&&(diffX>delta))
_.next();else if((diffY<boundary&&diffY>(-1*boundary))&&(diffX<(-1*delta)))
_.previous();var th=_.$viewer.outerHeight(),ts=(_.$viewer.get(0).scrollHeight-_.$viewer.scrollTop());if((_.$viewer.scrollTop()<=0&&diffY<0)||(ts>(th-2)&&ts<(th+2)&&diffY>0)){event.preventDefault();event.stopPropagation();}});_.$main.on('touchstart',function(event){if(skel.breakpoint('xsmall').active)
return;_.$main.touchPosX=event.originalEvent.touches[0].pageX;_.$main.touchPosY=event.originalEvent.touches[0].pageY;}).on('touchmove',function(event){if(skel.breakpoint('xsmall').active)
return;if(_.$main.touchPosX===null||_.$main.touchPosY===null)
return;var diffX=_.$main.touchPosX-event.originalEvent.touches[0].pageX,diffY=_.$main.touchPosY-event.originalEvent.touches[0].pageY;boundary=20,delta=50,result=false;switch(_.settings.mainSide){case 'left':result=(diffY<boundary&&diffY>(-1*boundary))&&(diffX>delta);break;case 'right':result=(diffY<boundary&&diffY>(-1*boundary))&&(diffX<(-1*delta));break;default:break;}
if(result)
_.hide();var th=_.$main.outerHeight(),ts=(_.$main.get(0).scrollHeight-_.$main.scrollTop());if((_.$main.scrollTop()<=0&&diffY<0)||(ts>(th-2)&&ts<(th+2)&&diffY>0)){event.preventDefault();event.stopPropagation();}});_.$toggle.on('click',function(){_.toggle();});_.$toggle.on('touchend',function(event){event.stopPropagation();});_.$navNext.on('click',function(){_.next();});_.$navPrevious.on('click',function(){_.previous();});_.$body.on('keydown','input,select,textarea',function(event){event.stopPropagation();});_.$window.on('keydown',function(event){if(skel.breakpoint('xsmall').active)
return;if(event.keyCode in _.keys){event.stopPropagation();event.preventDefault();(_.keys[event.keyCode])();}});},initViewer:function(){_.$thumbnails.on('click','.thumbnail',function(event){var $this=$(this);event.preventDefault();event.stopPropagation();if(_.locked)
$this.blur();_.switchTo($this.data('index'));});_.$thumbnails.children().each(function(){var $this=$(this),$thumbnail=$this.children('.thumbnail'),s;s={$parent:$this,$slide:null,$slideImage:null,$slideCaption:null,url:$thumbnail.attr('href'),loaded:false};$this.attr('tabIndex','-1');s.$slide=$('<div class="slide"><div class="caption"></div><div class="image"></div></div>');s.$slideImage=s.$slide.children('.image');s.$slideImage.css('background-image','').css('background-position',($thumbnail.data('position')||'center'));s.$slideCaption=s.$slide.find('.caption');$this.children().not($thumbnail).appendTo(s.$slideCaption);if(_.settings.preload){console.log(s.url);var $img=$('<img src="'+s.url+'" />');s.$slideImage.css('background-image','url('+s.url+')');s.$slide.addClass('loaded');s.loaded=true;}
_.slides.push(s);$thumbnail.data('index',_.slides.length-1);});},init:function(){if(skel.vars.IEVersion<10){_.settings.slideDuration=0;_.settings.layoutDuration=0;}
skel.breakpoints({xlarge:'(max-width: 1680px)',large:'(max-width: 1280px)',medium:'(max-width: 980px)',small:'(max-width: 736px)',xsmall:'(max-width: 480px)'});_.initProperties();_.initViewer();_.initEvents();window.setTimeout(function(){skel.on('-xsmall !xsmall',function(){if(_.current===null)
_.switchTo(0,true);});},0);},switchTo:function(index,noHide){if(_.current==index&&!skel.breakpoint('xsmall').active)
return;if(_.locked)
return;_.locked=true;if(!noHide&&skel.breakpoint('medium').active&&skel.vars.IEVersion>8)
_.hide();var oldSlide=(_.current!==null?_.slides[_.current]:null),newSlide=_.slides[index];_.current=index;if(oldSlide){oldSlide.$parent.removeClass('active');oldSlide.$slide.removeClass('active');}
newSlide.$parent.addClass('active').focus();var f=function(){if(oldSlide)
oldSlide.$slide.detach();newSlide.$slide.appendTo(_.$viewer);if(!newSlide.loaded){window.setTimeout(function(){newSlide.$slide.addClass('loading');console.log(newSlide.url);$('<img src="'+newSlide.url+'" />').on('load',function(){newSlide.$slideImage.css('background-image','url('+newSlide.url+')');newSlide.loaded=true;newSlide.$slide.removeClass('loading');newSlide.$slide.addClass('active');window.setTimeout(function(){_.locked=false;},100);});},100);}
else{window.setTimeout(function(){newSlide.$slide.addClass('active');window.setTimeout(function(){_.locked=false;},100);},100);}};if(!oldSlide)
(f)();else
window.setTimeout(f,_.settings.slideDuration);},next:function(){var i,c=_.current,l=_.slides.length;if(c>=l-1)
i=0;else
i=c+1;_.switchTo(i);},previous:function(){var i,c=_.current,l=_.slides.length;if(c<=0)
i=l-1;else
i=c-1;_.switchTo(i);},up:function(){if(_.$body.hasClass('fullscreen'))
return;var i,c=_.current,l=_.slides.length,tpr=_.settings.thumbnailsPerRow;if(c<=(tpr-1))
i=l-(tpr-1-c)-1;else
i=c-tpr;_.switchTo(i);},down:function(){if(_.$body.hasClass('fullscreen'))
return;var i,c=_.current,l=_.slides.length,tpr=_.settings.thumbnailsPerRow;if(c>=l-tpr)
i=c-l+tpr;else
i=c+tpr;_.switchTo(i);},show:function(){if(!_.$body.hasClass('fullscreen'))
return;_.$body.removeClass('fullscreen');_.$main.focus();},hide:function(){if(_.$body.hasClass('fullscreen'))
return;_.$body.addClass('fullscreen');_.$main.blur();},toggle:function(){if(_.$body.hasClass('fullscreen'))
_.show();else
_.hide();},};return _;})(jQuery);main.init();