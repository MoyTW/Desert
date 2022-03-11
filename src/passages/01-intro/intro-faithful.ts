(function() {
  const _setup = setup as any

  _setup.Complete_IntroFaithful_WaitInChristies = function() {
    const _vars = State.variables as any

    if (_vars.IntroApostate_Start_DONE &&
        _vars.IntroFaithful_WaitInChristies_DONE) {
      delete _vars.IntroApostate_Start_DONE;
      delete _vars.IntroFaithful_WaitInChristies_DONE;
      Engine.play('IntroFaithfulMeetingApostate');
    }
  }

  _setup.Complete_IntroFaithfulWaitForChoices = function() {
    const _vars = State.variables as any

    if (_vars.IntroFaithfulWaitForChoices_DONE &&
        _vars.IntroApostateUnrecognizedChoices_CHOICE) {
      const data = _vars.IntroApostateUnrecognizedChoices_CHOICE
      if (data.choice === "OFFENDED") {
        Engine.play("IntroFaithfulChoiceOffended")
      } else if (data.choice === "RELIEVED") {
        Engine.play("IntroFaithfulChoiceRelieved");
      } else {
        Engine.play("IntroFaithfulChoiceGremlin");
      }
    }
  }
})()