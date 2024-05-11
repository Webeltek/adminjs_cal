import React, { useState, Component, useCallback, useReducer, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {MeshStandardMaterial, Mesh, Vector3} from 'three';
import { string } from 'prop-types';

const productsMeshes = (props) => {
  const { materialState, handleMaterial, records } = props;
  const { nodes, materials } = useGLTF('/rack1.gltf');

  return records.map((record) => (
    <mesh
      key={record.title}
      name={record.title}
      onPointerOver={(event) =>
        handleMaterial({ meshName: record.title, type: 'hoverOverProd', baseMaterial: threeMat.gray })
      }
      onPointerOut={(event) =>
        handleMaterial({ meshName: record.title, type: 'hoverOutProd', baseMaterial: threeMat.blue })
      }
      onClick={(event) =>
        handleMaterial({ meshName: record.title, type: 'clickedProd', baseMaterial: threeMat.orange })
      }
      castShadow
      receiveShadow
      geometry={nodes.Cube001.geometry}
      material={materialState[record.title].material}
      position={[
        materialState[record.title].position.x,
        materialState[record.title].position.y,
        materialState[record.title].position.z,
      ]}
      scale={[1.647, 1.794, 1.882]}
    ></mesh>
  ));
  
};

const threeMat = {
  gray: new MeshStandardMaterial({ color: 'dimgray' }),
  orange: new MeshStandardMaterial({ color: 'coral' }),
  blue: new MeshStandardMaterial({ color: 'darkgreen' }),
};

export const rack1hoc = (Model) => (props) => {
  const { nodes, materials } = useGLTF('/rack1.gltf');
  const ref = useRef<Mesh>(null!);
  const { records } = props;
  const [products, setProducts] = useState();
  //console.log("rack1hoc records: ",records);
  

  function createInitialState() {
    const nodeNames = Object.keys(nodes);
    //console.log('rack1hoc nodes', nodes);

    const nodeNamesWithMat = nodeNames.filter((nodeName) => nodes[nodeName].hasOwnProperty('material'));
    //console.log("rack1hoc nodeNamesWithMat: ",nodeNamesWithMat);
    const initState: Record<
      string,
      { material: MeshStandardMaterial; position: Vector3; isClicked: boolean; isHovered: boolean; ref? }
    > = {};
    nodeNamesWithMat.forEach((nodeName) => {
      initState[nodeName] = {
        material: nodes[nodeName].material,
        position: nodes[nodeName].position,
        isClicked: false,
        isHovered: false,
        ref: null,
      };
    });
    records.forEach((record) => {
      initState[record.title] = {
        material: threeMat.blue,
        position: new Vector3(record.params.positionX, record.params.positionY, record.params.positionZ),
        isClicked: false,
        isHovered: false,
        ref: null,
      };
    });
    //console.log("rack1hoc initState: ",initState);

    return initState;
  }

  const [materialState, dispatch] = useReducer(materialReducer, null, createInitialState);
  useEffect(() => {
    setProducts(productsMeshes({ materialState, handleMaterial, records }));
    console.log("react1hoc materialState: ",materialState);
    
  }, [records, materialState]);

  function materialReducer(
    state,
    action: { type: string; meshName: string; baseMaterial?: MeshStandardMaterial; position?: any },
  ) {
    switch (action.type) {
      case 'hoverOverProd':
        if (state[action.meshName].isClicked) {
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: state[action.meshName].position,
              isClicked: true,
              isHovered: false,
            },
          };
        } else {
          return {
            ...state,
            [action.meshName]: {
              material: action.baseMaterial,
              position: state[action.meshName].position,
              isClicked: false,
              isHovered: true,
            },
          };
        }
      case 'hoverOutProd':
        if (state[action.meshName].isClicked) {
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: state[action.meshName].position,
              isClicked: true,
              isHovered: false,
            },
          };
        } else {
          return {
            ...state,
            [action.meshName]: {
              material: action.baseMaterial,
              position: state[action.meshName].position,
              isClicked: false,
              isHovered: false,
            },
          };
        }
      case 'clickedProd':
        if (state[action.meshName].isClicked) {
          state[action.meshName].position.z += 0.1;
          //console.log('rack1hoc state[action.meshName].position', state[action.meshName].position);

          return {
            ...state,
            [action.meshName]: {
              material: action.baseMaterial,
              position: state[action.meshName].position,
              isClicked: !state[action.meshName].isClicked,
              isHovered: false,
            },
          };
        } else {
          state[action.meshName].position.z -= 0.1;
          //console.log('rack1hoc state[action.meshName].position', state[action.meshName].position);
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: state[action.meshName].position,
              isClicked: !state[action.meshName].isClicked,
              isHovered: false,
            },
          };
        }      
      case 'hoverOver':
        if (state[action.meshName].isClicked) {
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: nodes[action.meshName].position,
              isClicked: true,
              isHovered: false,
            },
          };
        } else {
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.gray,
              position: nodes[action.meshName].position,
              isClicked: false,
              isHovered: true,
            },
          };
        }
      case 'hoverOut':
        if (state[action.meshName].isClicked) {
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: nodes[action.meshName].position,
              isClicked: true,
              isHovered: false,
            },
          };
        } else {
          return {
            ...state,
            [action.meshName]: {
              material: nodes[action.meshName].material,
              position: nodes[action.meshName].position,
              isClicked: false,
              isHovered: false,
            },
          };
        }
      case 'clicked':
        if (state[action.meshName].isClicked) {
          state[action.meshName].position.z += 0.1;
          //console.log('rack1hoc state[action.meshName].position', state[action.meshName].position);

          return {
            ...state,
            [action.meshName]: {
              material: nodes[action.meshName].material,
              position: state[action.meshName].position,
              isClicked: !state[action.meshName].isClicked,
              isHovered: false,
            },
          };
        } else {
          state[action.meshName].position.z -= 0.1;
          //console.log('rack1hoc state[action.meshName].position', state[action.meshName].position);
          return {
            ...state,
            [action.meshName]: {
              material: threeMat.orange,
              position: state[action.meshName].position,
              isClicked: !state[action.meshName].isClicked,
              isHovered: false,
            },
          };
        }
    }
  }
  const handleMaterial = (args) => {
    let { meshName, type, baseMaterial, position } = args;
    switch (type) {
      case 'hoverOver':
        dispatch({ type: 'hoverOver', meshName: meshName });
        //console.log('handleMaterial hoverOver');
        break;
      case 'hoverOut':
        dispatch({ type: 'hoverOut', meshName: meshName });
        break;
      case 'clicked':
        dispatch({ type: 'clicked', meshName: meshName });
        break;
      case 'hoverOverProd':
        dispatch({ type: 'hoverOverProd', meshName: meshName, baseMaterial: baseMaterial, position: position });
        break;
      case 'hoverOutProd':
        dispatch({ type: 'hoverOutProd', meshName: meshName, baseMaterial: baseMaterial, position: position });
        break;
      case 'clickedProd':
        dispatch({ type: 'clickedProd', meshName: meshName, baseMaterial: baseMaterial, position: position });
        break;
    }
  };
  return <Model materialState={materialState} handleMaterial={handleMaterial} products={products} />;
};

useGLTF.preload('/rack1.gltf');
