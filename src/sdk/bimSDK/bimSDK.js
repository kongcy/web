import * as THREE from './lib/three.module.js';

import { TrackballControls } from "./lib/TrackballControls.js";

import { MTLLoader } from "./lib/MTLLoader.js";
import { OBJLoader2 } from "./lib/OBJLoader2.js";
import { MtlObjBridge } from "./lib/MtlObjBridge.js";
import axios from 'axios'
let mouseMove = new THREE.Vector2(), INTERSECTED;

const OBJLoader2Example = function ( elementToBindTo, moduleURL ) {
	this.renderer = null;
	this.canvas = elementToBindTo;
	this.moduleURL = moduleURL;
	this.aspectRatio = 1;
	this.recalcAspectRatio();

	this.scene = null;
	this.cameraDefaults = {
		posCamera: new THREE.Vector3( 0.0, 175.0, 500.0 ),
		posCameraTarget: new THREE.Vector3( 0, 0, 0 ),
		near: 0.1,
		far: 10000,
		fov: 45
	};
	this.camera = null;
	this.cameraTarget = this.cameraDefaults.posCameraTarget;

	this.controls = null;
	this.raycasterMove = null;

	this.meshZJ = null;
	this.meshMFL = null;
};

OBJLoader2Example.prototype = {

	constructor: OBJLoader2Example,

	initGL: function () {
		this.raycasterMove = new THREE.Raycaster();

		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: true,
			autoClear: true
		} );
		this.renderer.setClearColor( 0x050505 );

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera( this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far );
		this.resetCamera();
		this.controls = new TrackballControls( this.camera, this.renderer.domElement );

		let ambientLight = new THREE.AmbientLight( 0x404040 );
		let directionalLight1 = new THREE.DirectionalLight( 0xC0C090 );
		let directionalLight2 = new THREE.DirectionalLight( 0xC0C090 );

		directionalLight1.position.set( - 100, - 50, 100 );
		directionalLight2.position.set( 100, 50, - 100 );

		this.scene.add( directionalLight1 );
		this.scene.add( directionalLight2 );
		this.scene.add( ambientLight );

		//let helper = new THREE.GridHelper( 1200, 60, 0xFF4444, 0x404040 );
		//this.scene.add( helper );
		document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
		document.addEventListener( 'click', (event) => {this.onDocumentMouseDown(event, this)}, false );
	},

	initContent: async function () {
		let scope = this;
		let modelNameZJ = 'ZJ';
		let objLoaderZJ = new OBJLoader2();
		let mtlLoaderZJ = new MTLLoader();
		let callbackOnLoadZJ = function ( object3d ) {
			scope.scene.add( object3d );
			console.log( 'Loading complete: ' + modelNameZJ );
			scope._reportProgress( { detail: { text: '' } } );
			scope.meshZJ = object3d.children[0];
		};
		let onLoadMtlZJ = function ( mtlParseResult ) {
			objLoaderZJ.setModelName( modelNameZJ );
			objLoaderZJ.setLogging( true, true );
			objLoaderZJ.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
			// let zj = await axios.get('https://xtxk.com/BIMDataWeb/ZJ.obj')
			objLoaderZJ.load(scope.moduleURL + '/ZJ.obj', callbackOnLoadZJ, null, null, null );
			// objLoaderZJ.load( './model/ZJ.obj', callbackOnLoadZJ, null, null, null );
		};
		this._reportProgress( { detail: { text: 'Loading: ' + modelNameZJ } } );
		// mtlLoaderZJ.load( './model/ZJ.mtl', onLoadMtlZJ );
		mtlLoaderZJ.load(scope.moduleURL + '/ZJ.mtl', onLoadMtlZJ );
		let modelNameMFL = 'MFL';
		let objLoaderMFL = new OBJLoader2();
		let mtlLoaderMFL = new MTLLoader();
		let callbackOnLoadMFL = function ( object3d ) {
			scope.scene.add( object3d );
			console.log( 'Loading complete: ' + modelNameMFL );
			scope._reportProgress( { detail: { text: '' } } );
			scope.meshMFL = object3d.children[0];
		};
		let onLoadMtlMFL = function ( mtlParseResult ) {
			objLoaderMFL.setModelName( modelNameMFL );
			objLoaderMFL.setLogging( true, true );
			objLoaderMFL.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
			// objLoaderMFL.load( './model/MFL.obj', callbackOnLoadMFL, null, null, null );
			objLoaderMFL.load( scope.moduleURL + '/MFL.obj', callbackOnLoadMFL, null, null, null );
		};
		this._reportProgress( { detail: { text: 'Loading: ' + modelNameMFL } } );
		// mtlLoaderMFL.load( './model/MFL.mtl', onLoadMtlMFL );
		mtlLoaderMFL.load( scope.moduleURL + '/MFL.mtl', onLoadMtlMFL );
	},

	_reportProgress: function ( event ) {
		let output = '';
		if ( event.detail !== null && event.detail !== undefined && event.detail.text ) {

			output = event.detail.text;

		}
		console.log( 'Progress: ' + output );
		document.getElementById( 'feedback' ).innerHTML = output;
	},

	resizeDisplayGL: function () {
		this.controls.handleResize();

		this.recalcAspectRatio();
		this.renderer.setSize( this.canvas.offsetWidth, this.canvas.offsetHeight, false );

		this.updateCamera();
	},

	recalcAspectRatio: function () {
		this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
	},

	resetCamera: function () {
		this.camera.position.copy( this.cameraDefaults.posCamera );
		this.cameraTarget.copy( this.cameraDefaults.posCameraTarget );

		this.updateCamera();
	},

	updateCamera: function () {
		this.camera.aspect = this.aspectRatio;
		this.camera.lookAt( this.cameraTarget );
		this.camera.updateProjectionMatrix();
	},

	render: function () {
		if ( !this.renderer.autoClear ) this.renderer.clear();
		this.controls.update();

		if(this.meshMFL != null){
			let array = new Array();
			array.push(this.meshMFL);
			this.raycasterMove.setFromCamera( mouseMove, this.camera );
			let intersects = this.raycasterMove.intersectObjects( array );
			if ( intersects.length > 0  && this.meshMFL == intersects[ 0 ].object ) {
				//this.meshMFL.material[24].color.set( 0xff0000 );
				this.canvas.style.cursor = 'pointer';
			} else {
				this.canvas.style.cursor = '';
			}
		}
		this.renderer.render( this.scene, this.camera );
	},
	onDocumentMouseMove : function ( event ){
		event.preventDefault();
		mouseMove.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouseMove.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	},
	
	onDocumentMouseDown : function( event, that) {
		event.preventDefault();
		if(that.meshMFL == null){
			console.log(111);
			return;
		}
		let mouse = new THREE.Vector2()
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		let array = new Array();
		array.push(that.meshMFL);
		let raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouse, that.camera );

		let intersects = raycaster.intersectObjects( array );
		if(intersects.length > 0){
			window.alert( 'Hello,world...' );
		}
	}
};
export default OBJLoader2Example;