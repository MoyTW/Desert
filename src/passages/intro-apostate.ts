(function() {
  const _setup = setup as any

  _setup.Complete_IntroApostate_MeetingFaithful = function() {
    const _vars = State.variables as any

    if (_vars.IntroFaithfulMeetingApostate_GREETING &&
        _vars.IntroApostate_MeetingFaithful_DONE) {
      const choice = _vars.IntroFaithfulMeetingApostate_GREETING.greeting
      delete _vars.IntroFaithfulMeetingApostate_GREETING
      delete _vars.IntroApostate_MeetingFaithful_DONE

      if (choice === "FAMILIAR") {
        Engine.play("IntroApostateFamiliarGreeting")
      } else if (choice === "STRANGER") {
        Engine.play("IntroApostateStrangerGreeting")
      } else {
        Engine.play("IntroApostateNoGreeting")
      }
    }
  };

  _setup.Complete_IntroFaithful_MercsEnter = function() {
    const _vars = State.variables as any

    if (_vars.IntroFaithful_WaitingAwkwardly_CHOICE &&
        _vars.IntroApostate_MercsEnter_CHOICE) {
      Engine.play("IntroFaithful_JekuMercsChat")
    }
  }
})()