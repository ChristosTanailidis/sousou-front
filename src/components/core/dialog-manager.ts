
export const isOpen = shallowRef(false)

export const childComponent = shallowRef()

export const childProps = ref()

export const openDialog = (component: any, props?: any) => {
  console.log('i ran tho')
  isOpen.value = true
  childComponent.value = component
  childProps.value = props
}
