import React, { Fragment } from 'react'
import { useTranslation} from 'adminjs'
import { Link } from '@adminjs/design-system'

const linkBase =
  'https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/'

export default function DemoLink({ fileName, children }) {
  const { translateLabel } = useTranslation()
  return (
    <Fragment>
      <Link  href={`${linkBase}${fileName}.js`} size='lg'>
          &lt;\&gt; {translateLabel('SelectableSourceCode')}
      </Link>
      {children ? <div style={{ marginBottom: 10 }}>{children}</div> : null}
    </Fragment>
  )
}