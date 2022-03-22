(function() {
  const _setup = setup as any

  _setup.Complete_MercsApostate_Start = function() {
    const _vars = State.variables as any;

    if (_vars.MercsFaithful_Start_CHOICE &&
        _vars.MercsApostate_Start_CHOICE) {
      const faithfulChoice = _vars.MercsFaithful_Start_CHOICE.choice
      const apostateChoice = _vars.MercsApostate_Start_CHOICE.choice

      if (faithfulChoice === "CHAT" && apostateChoice === "TALK") {
        Engine.play("MercsApostate_JekuChat_EbiTalk")
      } else if (faithfulChoice === "CHAT" && apostateChoice === "SILENT") {
        Engine.play("MercsApostate_JekuChat_EbiSilent")
      } else if (faithfulChoice === "REJECT" && apostateChoice === "TALK") {
        Engine.play("MercsApostate_JekuReject_EbiTalk")
      } else if (faithfulChoice === "REJECT" && apostateChoice === "SILENT") {
        Engine.play("MercsApostate_JekuReject_EbiSilent")
      }
    }
  }

  _setup.Complete_MercsApostate_JekuMercsChat = function() {
    const _vars = State.variables as any

    if (_vars.MercsApostate_EbiTalk_DONE &&
        _vars.MercsFaithful_EbiTalk_CHOICE) {
      const faithfulChoice: string = _vars.MercsFaithful_EbiTalk_CHOICE.choice;
      delete _vars.MercsApostate_EbiTalk_DONE
      delete _vars.MercsFaithful_EbiTalk_CHOICE

      if (faithfulChoice === "ANGER") {
        Engine.play("MercsApostate_EbiTalk_JekuAngry")
      } else if (faithfulChoice === "IGNORE") {
        Engine.play("MercsApostate_EbiTalk_JekuIgnore")
      }
    }
  }
})()