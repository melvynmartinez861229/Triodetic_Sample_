import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { EventEmitter } from 'events'
import Experience from "../Experience.js"

export default class Resources extends EventEmitter {
  constructor(assets) {
    super()
    this.experience = new Experience()
    this.renderer = this.experience.renderer

    this.assets = assets

    this.items = {}
    this.queue = this.assets.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.dracoLoader.setDecoderPath("/draco/")
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    for(const asset of this.assets) {
      if (asset.type === 'glbModel') {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file)
        })
      } else if (asset.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(asset.path, (file => {
          this.singleAssetLoaded(asset, file)
        }))
      // } else if (asset.type === 'videoTexture') {
      //   this.video = {}
      //   this.videoTexture = {}

      //   this.video[asset.name] = document.createElement("video")
      //   this.video[asset.name].src = asset.path
      //   this.video[asset.name].playInline = true
      //   this.video[asset.name].muted = true
      //   this.video[asset.name].autoplay = true
      //   this.video[asset.name].loop = true
      //   this.video[asset.name].play()

      //   this.videoTexture[asset.name] = new THREE.VideoTexture(
      //     this.video[asset.name]
      //   )
      //   this.videoTexture[asset.name].flipY = true
      //   this.videoTexture[asset.name].minFilter = THREE.NearestFilter
      //   this.videoTexture[asset.name].mageFilter = THREE.NearestFilter
      //   this.videoTexture[asset.name].generateMipmaps = false
      //   this.videoTexture[asset.name].encoding = THREE.sRGBEncoding

      //   this.singleAssetLoaded(asset, this.videoTexture[asset.name])
      }
    }
    //console.log("startLoading()");
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file
    this.loaded++

    if (this.loaded === this.queue) {
      this.emit('ready')
    }
  }
}
