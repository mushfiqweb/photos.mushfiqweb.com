;if(CloudflareApps.matchPage(CloudflareApps.installs['zquBlCesYh0G'].URLPatterns)){(function(){'use strict'
if(!window.addEventListener)return
if(window.frameElement)return
var options=CloudflareApps.installs['zquBlCesYh0G'].options
var element
function getMaxZIndex(){var max=0
var elements=document.getElementsByTagName('*')
Array.prototype.slice.call(elements).forEach(function(element){var zIndex=parseInt(document.defaultView.getComputedStyle(element).zIndex,10)
max=zIndex?Math.max(max,zIndex):max})
return max}
function hideAlert(e){e.preventDefault()
element.style.display='none'
document.cookie='coockiless=1; expires=Thu, 18 Dec 2050 12:00:00 UTC'
if(localStorage){localStorage.coockiless=1}}
function updateElement(){if(localStorage&&localStorage.coockiless)return
element=CloudflareApps.createElement({selector:'body',method:'append'},element)
element.setAttribute('app','cookiless')
element.style.zIndex=getMaxZIndex()+1
var ckElement=document.createElement('cookiless-div')
ckElement.className='ckcontent'
ckElement.style.opacity=options.opacity/100
var ckPolicyText=document.createElement('policy-text')
ckPolicyText.textContent=options.policyText
var ckAcceptButton=document.createElement('a')
ckAcceptButton.className='iAccept'
ckAcceptButton.textContent=options.acceptButton
ckElement.appendChild(ckPolicyText)
ckElement.appendChild(ckAcceptButton)
element.appendChild(ckElement)
element.querySelectorAll('.iAccept')[0].addEventListener('click',hideAlert)}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',updateElement)}else{updateElement()}
window.CloudflareApps.installs['zquBlCesYh0G'].scope={setOptions:function setOptions(nextOptions){options=nextOptions
updateElement()}}}())};(function(){try{var link=document.createElement('link');link.rel='stylesheet';link.href='data:text/css;charset=utf-8;base64,Y2xvdWRmbGFyZS1hcHBbYXBwPSJjb29raWxlc3MiXSB7DQogcG9zaXRpb246IGZpeGVkOw0KIHdpZHRoOiAxMDAlOw0KIGJvdHRvbTogMDsNCiBsZWZ0OiAwOw0KIHotaW5kZXg6IDEwMDAwOw0KIGxpbmUtaGVpZ2h0OiAyNHB4Ow0KfQ0KDQpjbG91ZGZsYXJlLWFwcFthcHA9ImNvb2tpbGVzcyJdIGNvb2tpbGVzcy1kaXYgew0KICB3aWR0aDogMTAwJTsNCiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsNCiAgY29sb3I6ICNmZmY7DQogIHBhZGRpbmc6IDEwcHg7DQogIHRleHQtYWxpZ246IGNlbnRlcjsNCiAgZGlzcGxheTogYmxvY2s7DQp9DQpjbG91ZGZsYXJlLWFwcFthcHA9ImNvb2tpbGVzcyJdIGNvb2tpbGVzcy1kaXYgLmlBY2NlcHQgew0KICBjdXJzb3I6IHBvaW50ZXI7DQogIG1hcmdpbi1sZWZ0OiAxMHB4Ow0KICBjb2xvcjogIzE1OUNEODsNCn0NCg==';document.getElementsByTagName('head')[0].appendChild(link);}catch(e){}})();