(function() {
  const _setup = setup as any

  _setup.Complete_IntroFaithful_MercsEnter = function() {
    const _vars = State.variables as any

    if (_vars.IntroFaithful_WaitingAwkwardly_CHOICE &&
        _vars.IntroApostate_MercsEnter_CHOICE) {
      Engine.play("IntroFaithful_JekuMercsChat")
    }
  }
})()