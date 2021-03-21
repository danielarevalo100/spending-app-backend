const utils = {
  cleanData : (obj, toClean) => {
    const cloned = {...obj};
    toClean.forEach( item => {
      delete cloned[item]
    } ) 
    return cloned
  }
}

module.exports = utils
