(function() {
  const _setup = setup as any

  _setup.Complete_MercsFaithful_Start = function() {
    const _vars = State.variables as any

    if (_vars.MercsFaithful_Start_CHOICE &&
        _vars.MercsApostate_Start_CHOICE) {
      Engine.play("MercsFaithful_JekuMercsChat")
    }
  }
})()