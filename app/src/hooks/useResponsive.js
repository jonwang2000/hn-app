//  useResponsive.js

//  Hook-based replacement when migrating base to function intead of class components

import React from 'react'
import includes from 'lodash/includes'

import withWidth from '@material-ui/core/withWidth'

const useResponsive = () => (WrappedComponent) => {
    const Responsive = props => {
        const onMobile = includes(['xs', 'sm'], props.width)

        const newProps = { ...props, onMobile }

        return <WrappedComponent { ...newProps } />
    }

    return withWidth()(Responsive)
}

export default useResponsive