(function() {
  const _setup = setup as any

  _setup.Complete_IntroApostate_ReadLetter = function() {
    const _vars = State.variables as any;

    if (_vars.IntroApostate_Start_DONE && _vars.IntroFaithful_WaitInChristies_DONE) {
      delete _vars.IntroApostate_Start_DONE;
      delete _vars.IntroFaithful_WaitInChristies_DONE;
      Engine.play('IntroApostate_MeetingFaithful');
    }
  }

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
  }

  _setup.Complete_IntroApostateWaitForFaithfulReaction = function() {
    const _vars = State.variables as any

    if (_vars.IntroApostateWaitForFaithfulReaction_DONE &&
        _vars.IntroFaithfulAliveReactionChoice_CHOICE) {
      const choice = _vars.IntroFaithfulAliveReactionChoice_CHOICE.choice;
      if (choice === "HAPPY") {
        Engine.play("IntroApostateReactionChoiceHappy")
      } else if (choice === "SAD") {
        Engine.play("IntroApostateReactionChoiceSad");
      } else {
        Engine.play("IntroApostateReactionChoiceAngry");
      }
    }
  }
})()