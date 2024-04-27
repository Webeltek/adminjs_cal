import React, { useState, Component, useCallback, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { string } from 'prop-types';

export const rack1hoc = (Model) => {
  const { nodes, materials } = useGLTF('/rack1.gltf');

  function createInitialState() {
    const nodeNames = Object.keys(nodes);
    console.log('rack1hoc nodes', nodes);

    const nodeNamesWithMat = nodeNames.filter((nodeName) => nodes[nodeName].hasOwnProperty('material'));
    //console.log("rack1hoc nodeNamesWithMat: ",nodeNamesWithMat);
    const initState: Record<
      string,
      { material: THREE.MeshStandardMaterial; position: THREE.Vector3; isClicked: boolean; isHovered: boolean }
    > = {};
    nodeNamesWithMat.forEach((nodeName) => {
      initState[nodeName] = {
        material: nodes[nodeName].material,
        position: nodes[nodeName].position,
        isClicked: false,
        isHovered: false,
      };
    });
    //console.log("rack1hoc initState: ",initState);

    return initState;
  }

  const threeMat = {
    gray: new THREE.MeshStandardMaterial({ color: 'dimgray' }),
    orange: new THREE.MeshStandardMaterial({ color: 'coral' }),
    blue: new THREE.MeshStandardMaterial({ color: 'darkcian' }),
  };

  const [materialState, dispatch] = useReducer(materialReducer, null, createInitialState);

  function materialReducer(
    state,
    action: { type: string; meshName: string; baseMaterial?: THREE.MeshStandardMaterial },
  ) {
    switch (action.type) {
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
          break;
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
          break;
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
          break;
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
          break;
        }
      case 'clicked':
        if (state[action.meshName].isClicked) {
          state[action.meshName].position.z += 0.1;
          console.log("rack1hoc state[action.meshName].position",state[action.meshName].position);
          
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
          console.log("rack1hoc state[action.meshName].position",state[action.meshName].position);
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

        break;
    }
  }
  const handleMaterial = (args) => {
    let { meshName, type } = args;
    switch (type) {
      case 'hoverOver':
        dispatch({ type: 'hoverOver', meshName: meshName });
        console.log('handleMaterial hoverOver');
        break;
      case 'hoverOut':
        dispatch({ type: 'hoverOut', meshName: meshName });
        break;
      case 'clicked':
        dispatch({ type: 'clicked', meshName: meshName });
        break;
    }
  };
  return <Model materialState={materialState} handleMaterial={handleMaterial} />;
};

useGLTF.preload('/rack1.gltf');
