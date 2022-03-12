(function() {
  const _setup = setup as any

  _setup.Complete_MercsFaithful_Start = function() {
    const _vars = State.variables as any

    if (_vars.MercsFaithful_Start_CHOICE &&
        _vars.MercsApostate_Start_CHOICE) {
      const faithfulChoice = _vars.MercsFaithful_Start_CHOICE.choice
      const apostateChoice = _vars.MercsApostate_Start_CHOICE.choice

      if (faithfulChoice === "CHAT" && apostateChoice === "TALK") {
        Engine.play("MercsFaithful_JekuChat_EbiTalk")
      } else if (faithfulChoice === "CHAT" && apostateChoice === "SILENT") {
        Engine.play("MercsFaithful_JekuChat_EbiSilent")
      } else if (faithfulChoice === "REJECT" && apostateChoice === "TALK") {
        Engine.play("MercsFaithful_JekuReject_EbiTalk")
      } else {
        Engine.play("MercsFaithful_JekuReject_EbiSilent")
      }
    }
  }
})()