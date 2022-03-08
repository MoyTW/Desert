(function() {
  const _setup = setup as any

  _setup.Complete_IntroApostate_MeetingFaithful = function() {
    const _vars = State.variables as any

    if (_vars.IntroFaithfulMeetingApostate_GREETING && _vars.IntroApostate_MeetingFaithful_Done) {
      const choice = _vars.IntroFaithfulMeetingApostate_GREETING.greeting
      delete _vars.IntroFaithfulMeetingApostate_GREETING
      delete _vars.IntroApostate_MeetingFaithful_Done

      if (choice === "FAMILIAR") {
        Engine.play("IntroApostateFamiliarGreeting")
      } else if (choice === "STRANGER") {
        Engine.play("IntroApostateStrangerGreeting")
      } else {
        Engine.play("IntroApostateNoGreeting")
      }
    }
  };
})()