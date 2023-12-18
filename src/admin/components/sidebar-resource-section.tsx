/* eslint-disable react/jsx-one-expression-per-line */
import React, { FC } from 'react';
import { Navigation } from '@adminjs/design-system';
import { useTranslation, type SidebarResourceSectionProps, useNavigationResources } from 'adminjs';
import { element } from 'prop-types';

const SidebarResourceSection = ({ resources } : SidebarResourceSectionProps) => {
  const elements = useNavigationResources(resources);
  const { translateLabel } = useTranslation();

  const elementsLabels = elements.map((element) => {
    if (element.label==="Mongoose Users"){
      element.label = translateLabel("Mongoose Users");
      console.log("sidebar-resource-section label",element.label);
    }})
  

  const openUrl = (url: string) => () => {
    window.open(url, '_blank');
  };

  elements.unshift({
    icon: 'Truck',
    label: translateLabel('kanbanBoard'),
    onClick: openUrl('https://github.com/orgs/SoftwareBrothers/projects/5'),
  });

  elements.unshift({
    icon: 'PieChart',
    label: translateLabel('stats'),
    onClick: openUrl('https://stats.adminjs.co'),
  });

  return <Navigation label={translateLabel('navigation')} elements={elements} />;
};

export default SidebarResourceSection;
