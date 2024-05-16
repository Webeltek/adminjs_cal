/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Box, ButtonGroup, cssClass, H2, H3 } from '@adminjs/design-system';
import React, { useRef, useState, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { useActionResponseHandler, useTranslation, useModal } from 'adminjs';
import { ActionJSON, buildActionClickHandler, useRecords } from 'adminjs';
import { getActionElementCss, getResourceElementCss } from 'adminjs';
import { Breadcrumbs } from 'adminjs';
import { ActionHeaderProps } from 'adminjs';
import { actionsToButtonGroup } from 'adminjs';
import { StyledBackButton } from 'adminjs';
import { useFilterDrawer } from 'adminjs';
import { Canvas, useFrame, ThreeElements , extend } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, OrbitControls , GizmoHelper, GizmoViewport, Text} from '@react-three/drei';
import { Model } from './rack1.js';
import { rack1hoc } from './rack1hoc.js';


/**
 * Header of an action. It renders Action name with buttons for all the actions.
 *
 * ### Usage
 *
 * ```
 * import { ActionHeader } from 'adminjs'
 * ```
 *
 * @component
 * @subcategory Application
 */
const ActionHeader: React.FC<ActionHeaderProps> = (props) => {
  const { resource, actionPerformed, record, action, tag, omitActions, toggleFilter: isFilterButtonVisible } = props;
  const translateFunctions = useTranslation();
  const { translateButton, translateAction } = translateFunctions;
  const navigate = useNavigate();
  const location = useLocation();
  const actionResponseHandler = useActionResponseHandler(actionPerformed);
  const modalFunctions = useModal();
  const { toggleFilter } = useFilterDrawer();
  const { records} = useRecords(resource.id);


  if (action.hideActionHeader) {
    return null;
  }

  const resourceId = resource.id;
  const params = { resourceId, recordId: record?.id };
  // eslint-disable-next-line max-len
  const handleActionClick = (event, sourceAction: ActionJSON): any | Promise<any> =>{
    //console.log("action-header typeof buildActionClickHandler", typeof buildActionClickHandler)
    const buildActionClickHandlerFunc = buildActionClickHandler ? buildActionClickHandler({
      action: sourceAction,
      params,
      actionResponseHandler,
      navigate,
      location,
      translateFunctions,
      modalFunctions,
    }) : ()=>{} ;
    return buildActionClickHandlerFunc(event);
  }

  const actionButtons = actionsToButtonGroup({
    actions: record
      ? record.recordActions.filter((ra) => !action || action.name !== ra.name)
      : // only new action should be seen in regular "Big" actions place
        resource.resourceActions.filter((ra) => ra.name === 'new' && (!action || action.name !== ra.name)),
    params,
    handleClick: handleActionClick,
    translateFunctions,
    modalFunctions,
  });

  if (typeof isFilterButtonVisible === 'function' || isFilterButtonVisible) {
    actionButtons.push({
      label: translateButton('filter', resource.id),
      onClick: toggleFilter,
      icon: 'Filter',
      //'data-css': getResourceElementCss(resource.id, 'filter-button'),
    });
  }

  // list and new actions are special and are are always
  const customResourceButtons = actionsToButtonGroup({
    actions: action.showResourceActions
      ? resource.resourceActions.filter((ra) => !['list', 'new'].includes(ra.name))
      : [],
    params: { resourceId },
    handleClick: handleActionClick,
    translateFunctions,
    modalFunctions,
  });

  const title = action ? translateAction(action.label, resourceId) : resource.name;

  // styled which differs if action header is in the drawer or not
  const cssIsRootFlex = !action.showInDrawer;
  const cssHeaderMT = action.showInDrawer ? '' : 'lg';
  const cssActionsMB = action.showInDrawer ? 'xl' : 'default';
  const CssHComponent = action.showInDrawer ? H3 : H2;
  //console.log('getActionElementCss', getActionElementCss);

  //const contentTag = getActionElementCss(resourceId, action.name, 'action-header')

  const Rack1Hoc =  rack1hoc(Model);

  return (
    <Box className={cssClass('ActionHeader')} data-css={'contentTag'}>
      {resourceId === "ProdAR" && 
        <Box height="50vh">
          
        </Box>
      }
      {resourceId === "Prod" && (
        <Box height="50vh">
          <Canvas>
            <Rack1Hoc records={records}/>
            <ambientLight intensity={Math.PI / 2} />
            <OrbitControls>
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              makeDefault="true"
            </OrbitControls>
            <GizmoHelper
              alignment="bottom-right" // widget alignment within scene
              margin={[50, 50]} // widget margins (X, Y)
    
              renderPriority={1}
            >
              <GizmoViewport axisColors={['coral', 'lightgreen', 'darkcyan']} labelColor="black" />
              {/* alternative: <GizmoViewcube /> */}
            </GizmoHelper>  
          </Canvas>
        </Box>
        )
      }
      {!action.showInDrawer && (
        <Box flex flexDirection="row" px={['default', 0]}>
          <Breadcrumbs resource={resource} actionName={action.name} record={record} />
          <Box flexShrink={0}>
            <ButtonGroup size="sm" rounded buttons={customResourceButtons} />
          </Box>
        </Box>
      )}
      <Box display={['block', cssIsRootFlex ? 'flex' : 'block']}>
        <Box mt={cssHeaderMT} flexGrow={1} px={['default', 0]}>
          <CssHComponent mb="lg">
            {action.showInDrawer && <StyledBackButton showInDrawer={action.showInDrawer} />}
            {title}
            {tag ? (
              <Badge variant="default" outline ml="default">
                {tag}
              </Badge>
            ) : null}
          </CssHComponent>
        </Box>
        {!omitActions && (
          <Box mt="xl" mb={cssActionsMB} flexShrink={0}>
            <ButtonGroup buttons={actionButtons} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { ActionHeader };
export default ActionHeader;
