import {BABYLON} from 'vue-babylonjs';

const MAX_ASSET_TO_LOAD = 2;

export default {

    data() {
        return {
            canvas: null,
            engine: null,
            scene: null,
            light_list: new Map(),
            camera_list: new Map(),
            ground_list: new Map(),
            mesh_list: new Map(),
            skeleton_list: new Map(),
            animation_list: new Map(),
            asset_loaded: 0,
        }
    },


    methods: {

        create_scene(canvas) {
            this.canvas = canvas;
            this.engine = new BABYLON.Engine(this.canvas);
            this.scene = new BABYLON.Scene(this.engine);
        },

        create_cameras() {
            // let camera = new BABYLON.FreeCamera("FollowCam", new BABYLON.Vector3(0, 2, -10), this.scene);
            let camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), this.scene);
            camera.attachControl(this.canvas, true);
            camera.radius = 20;
            camera.heightOffset = 5;
            camera.rotationOffset = 0;

            this.camera_list.set("FollowCam", camera);
        },

        create_lights() {
            this.light_list.set("HemisphericLight", new BABYLON.HemisphericLight("HemisphericLight", BABYLON.Vector3.Up(), this.scene));
        },

        create_grounds() {
            let ground = BABYLON.MeshBuilder.CreateGround("Ground", {
                height: 10,
                width: 20,
                subdivisions: 4
            });
            ground.position.x = 5
            this.ground_list.set("Ground", ground);
        },

        render_scene() {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        },
        load_assets() {

            // let assetsManager = new BABYLON.AssetsManager(this.myScene)

            BABYLON.SceneLoader.ImportMesh(
                "",
                'assets/',
                "submeshes_left_arm.glb",
                this.scene,
                this.success
            );
            BABYLON.SceneLoader.ImportMesh(
                "",
                'assets/',
                "submeshes_left_arm_2.glb",
                this.scene,
                (meshes, particleSystems, skeletons, animationGroups) => {
                    this.mesh_list.set('blue_left_arm', meshes[2])
                    this.mesh_list.set('blue_2be1_body', meshes[1])
                    this.mesh_list.set('blue_2be1', meshes[0])
                    this.skeleton_list.set('blue_2be1', skeletons[0])
                    this.animation_list.set('blue_2be1', animationGroups)
                    this.asset_loaded++;
                }
            );
        },

        success(meshes, particleSystems, skeletons, animationGroups) {

            this.mesh_list.set('left_arm', meshes[2])
            this.mesh_list.set('2be1', meshes[0])

            this.skeleton_list.set('2be1', skeletons[0])
            this.animation_list.set('2be1', animationGroups)
            this.asset_loaded++;
        },

        clone_mesh(name, root_mesh, root_skeleton, root_animation_group_list) {
            // maps use for unlink bones and animations
            let conversionMap = {}
            let storeMap = {}
            let clone_mesh = root_mesh.instantiateHierarchy(null, {doNotInstantiate: true}, (source, clone) => {
                conversionMap[source.uniqueId] = clone.uniqueId
                storeMap[clone.uniqueId] = clone
            });
            // clone the skeleton and attach it to clone_skeleton's descendants with sub-meshes
            let clone_skeleton = root_skeleton.clone("clone_skeleton");
            clone_skeleton.overrideMesh = clone_mesh;
            let descendants = clone_mesh.getDescendants(false);
            for (let i = 0; i < descendants.length; i++) {
                if (descendants[i].subMeshes) {
                    descendants[i].skeleton = clone_skeleton;
                }
            }
            // convert the _linkedTransformNode of clone_skeleton's bones
            for (let bone of clone_skeleton.bones) {
                if (bone._linkedTransformNode) {
                    bone._linkedTransformNode = storeMap[conversionMap[bone._linkedTransformNode.uniqueId]]
                }
            }
            // clone all animations group and change the target to the clone_mesh if it already had one
            let clone_animation_group_list = [];
            root_animation_group_list.forEach((animation_group) => {
                let clone_animation_group = animation_group.clone(animation_group.name + '-clone', (oldTarget) => {
                    let newTarget = storeMap[conversionMap[oldTarget.uniqueId]]
                    return newTarget || oldTarget
                })
                clone_animation_group_list.push(clone_animation_group)
            });

            this.mesh_list.set(name, clone_mesh);
            this.skeleton_list.set(name, clone_skeleton);
            this.animation_list.set(name, clone_animation_group_list);

        },
        show_world_axis(size) {
            let makeTextPlane = function (scene, text, color, size) {
                let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
                dynamicTexture.hasAlpha = true;
                dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
                let plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
                plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
                plane.material.backFaceCulling = false;
                plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
                plane.material.diffuseTexture = dynamicTexture;
                return plane;
            };
            let axisX = BABYLON.Mesh.CreateLines("axisX", [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], this.scene);
            axisX.color = new BABYLON.Color3(1, 0, 0);
            let xChar = makeTextPlane(this.scene, "X", "red", size / 10);
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
            let axisY = BABYLON.Mesh.CreateLines("axisY", [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], this.scene);
            axisY.color = new BABYLON.Color3(0, 1, 0);
            let yChar = makeTextPlane(this.scene, "Y", "green", size / 10);
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
            let axisZ = BABYLON.Mesh.CreateLines("axisZ", [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
            ], this.scene);
            axisZ.color = new BABYLON.Color3(0, 0, 1);
            let zChar = makeTextPlane(this.scene, "Z", "blue", size / 10);
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
        }
    },
    watch: {
        asset_loaded() {
            if (this.asset_loaded === MAX_ASSET_TO_LOAD) {
                // let's make the 2b3 : 2 clones of 2be1 !
                let rootMesh = this.mesh_list.get('2be1');
                let blue_rootMesh = this.mesh_list.get('blue_2be1');
                let rootSkeleton = this.skeleton_list.get('2be1');
                let rootAnimationGroups = this.animation_list.get('2be1');

                rootMesh.scaling = new BABYLON.Vector3(0.025, 0.025, .025);
                blue_rootMesh.scaling = new BABYLON.Vector3(0.025, 0.025, .025);
                blue_rootMesh.position.x = -5

                // add the blue left arm for the other .glb file
                let left_arm = this.mesh_list.get('left_arm');
                let blue_left_arm = this.mesh_list.get('blue_left_arm');
                // remove the original from the parent to have a clone in 0 0 0 coordinate (optional)
                blue_rootMesh.removeChild(blue_left_arm)
                let clone_blue_left_arm = blue_left_arm.clone('clone_blue_left_arm')
                clone_blue_left_arm.position.y = -5;
                // left_arm will be missing from the clones
                rootMesh.removeChild(left_arm)
                // add clone_blue_left_arm to the clones
                rootMesh.addChild(clone_blue_left_arm)

                // clean the scene, remove unused mesh
                this.scene.removeMesh(blue_rootMesh)
                this.scene.removeMesh(blue_left_arm)
                this.scene.removeMesh(clone_blue_left_arm)
                let blue_2be1_body = this.mesh_list.get('blue_2be1_body');
                this.scene.removeMesh(blue_2be1_body)

                // cloning
                let posX = 5;
                for (let i = 2; i < 4; i++) {
                    this.clone_mesh('2be' + i, rootMesh, rootSkeleton, rootAnimationGroups)
                    let clone = this.mesh_list.get('2be' + i);
                    clone.position.x = posX
                    posX += 5;
                }

                // focus
                let camera = this.camera_list.get("FollowCam");
                camera.lockedTarget = this.mesh_list.get('2be2');

            }
        }
    }
}