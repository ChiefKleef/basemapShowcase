export const constructVisEventData = visSetting => {
  return {
    field: visSetting.fieldValue,
    classes: visSetting.classNumValue,
    palette: visSetting.paletteValue
  }
}

export const visEventsAreDifferent = (last, next) => {
  if (last.field !== next.field || 
      last.classes !== next.classes ||
      last.palette !== next.palette) {
    return true;
  } else {
    return false;
  }
}

// currently unable to 'swap' in and out filters, so no need to check for that
export const filterEventsAreDifferent = (last, next) => {
  let differenceExists
  if (last.length !== next.length) {
    return true;
  } else if (last.length === 0 && next.length === 0){
    return false;
  } else {
    last.forEach(lastFiltSetting => {
      next.forEach(nextFiltSetting => {
        if (lastFiltSetting.key === nextFiltSetting.key){
          if (lastFiltSetting.field !== nextFiltSetting.field 
              || lastFiltSetting.range[0] !== nextFiltSetting.range[0]
              || lastFiltSetting.range[1] !== nextFiltSetting.range[1]){
                differenceExists = true
              }
        }
      });
    });
  }
  return differenceExists;
}