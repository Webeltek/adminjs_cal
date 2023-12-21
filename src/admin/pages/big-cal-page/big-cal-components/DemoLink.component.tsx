import React, { Fragment } from 'react'
import { useTranslation } from 'adminjs'

const linkBase =
  'https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/'

export default function DemoLink({ fileName, children }) {
  const { translateLabel } = useTranslation()
  return (
    <Fragment>
      <div style={{ marginBottom: 10 }}>
        <a target="_blank" href={`${linkBase}${fileName}.js`}>
          &lt;\&gt; {translateLabel('SelectableSourceCode')}
        </a>
      </div>
      {children ? <div style={{ marginBottom: 10 }}>{children}</div> : null}
    </Fragment>
  )
}