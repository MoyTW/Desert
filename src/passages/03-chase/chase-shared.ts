(function() {
  const _setup = setup as any
  _setup.Chase = {}

  const _incrementTurn = function() {
    const _vars = State.variables as any
    
    _vars.chaseTurn++

    // Set kidnappers variables
    if (_vars.chaseTurn >= 6) { // If you change this, update ChaseShared_KidnapperStatus
      _vars.kidnappersInSightOfChristies = false
      if (!_vars.apostateIsChasing && !_vars.faithfulIsChasing) {
        _vars.kidnappersEscaped = true
      }
    }
  }

  const _resolveChoice = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseApostate_CHOICE || !_vars.ChaseFaithful_CHOICE) {
      return false
    }

    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const apostateChoice: string = _vars.ChaseApostate_CHOICE_LAST.choice
    const apostatePassage: string = _vars.ChaseApostate_CHOICE_LAST.passage
    const faithfulChoice: string = _vars.ChaseFaithful_CHOICE_LAST.choice
    const faithfulPassage: string = _vars.ChaseFaithful_CHOICE_LAST.passage

    // Check for the special "CHASE_END" choice, which immediately terminates the chase
    if (apostateChoice === "CHASE_END" || faithfulChoice === "CHASE_END") {
      _vars.apostatePassage = "ChaseApostate_End"
      _vars.faithfulPassage = "ChaseFaithful_End"

      // Special case to catch kidnapping because I don't have to to properly fix this
      const apostateRoute = _apostateRoutingTable.get(apostatePassage)?.get(apostateChoice)
      if (apostateRoute != undefined) {
        apostateRoute[1]()
      }

      return true
    }

    const [nextApostatePassage, apostatePassageFn] = _apostateRoutingTable.get(apostatePassage)?.get(apostateChoice)!
    const [nextFaithfulPassage, faithfulPassageFn] = _faithfulRoutingTable.get(faithfulPassage)?.get(faithfulChoice)!
    _vars.apostatePassage = nextApostatePassage
    _vars.faithfulPassage = nextFaithfulPassage
    apostatePassageFn()
    faithfulPassageFn()

    _incrementTurn()
    
    return true
  }

  _setup.Chase.Route_ChaseApostate_Choice = function() {
    if (_resolveChoice()) {
      Engine.play((State.variables as any).apostatePassage)
    }
  }

  _setup.Chase.Route_ChaseFaithful_Choice = function() {
    if (_resolveChoice()) {
      Engine.play((State.variables as any).faithfulPassage)
    }
  }

  _setup.Chase.Complete_ChaseApostate_End = function() {
    const _vars = State.variables as any;
    
    if (!_vars.ChaseApostate_End_DONE || !_vars.ChaseFaithful_End_DONE) { return }

    if (_vars.apostateKidnappersKilled === 4) {
      Engine.play("EndingBloodyApostate_Start")
    } else if (_vars.apostateCaughtKidnappers || _vars.apostateIsChasing) {
      Engine.play("EndingDesertApostate_Start")
    } else if (_vars.called911) {
      Engine.play("EndingPoliceApostate_Start")
    } else {
      Engine.play("EndingBadApostate_Start")
    }
  }

  _setup.Chase.Complete_ChaseFaithful_End = function() {
    const _vars = State.variables as any;
    
    if (!_vars.ChaseApostate_End_DONE || !_vars.ChaseFaithful_End_DONE) { return }

    if (_vars.apostateKidnappersKilled === 4) {
      Engine.play("EndingBloodyFaithful_Start")
    } else if (_vars.apostateCaughtKidnappers || _vars.apostateIsChasing) {
      Engine.play("EndingDesertFaithful_Start")
    } else if (_vars.called911) {
      Engine.play("EndingPoliceFaithful_Start")
    } else {
      Engine.play("EndingBadFaithful_Start")
    }
  }

  const _apostateChristiesRouting = new Map<string,[string, () => void]>([
    ["FOOT", ["ChaseApostate_OnFoot", () => {
      (State.variables as any).apostateIsChasing = true
    }]],
    ["911", ["ChaseApostate_911", () => {
      (State.variables as any).apostateCanCall911 = false
    }]],
    ["CAR", ["ChaseApostate_Car", () => {}]],
    ["KING", ["ChaseApostate_King", () => {
      (State.variables as any).apostateCanTriageKing = false
    }]],
    ["BAR", ["ChaseApostate_Bar", () => {
      (State.variables as any).bartenderAction = "TALK";
      (State.variables as any).cookAction = "TALK";
    }]],
    ["CHASE_END", ["ChaseApostate_End", () => {}]],
    ["FREEZE", ["ChaseApostate_Christies", () => {}]],
  ])

  const _apostateRoutingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseApostate_Christies", _apostateChristiesRouting],
    // ########################################################################
    // # ON FOOT                                                              #
    // ########################################################################
    ["ChaseApostate_OnFoot", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_2", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).apostateCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_2", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_3", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).apostateCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_2", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_3", new Map<string,[string, () => void]>([
      ["ROAD", ["ChaseApostate_OnFoot_Road", () => {}]],
      ["SIDEWALK", ["ChaseApostate_OnFoot_Sidewalk", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_3", () => {}]], /* TODO: You get shot */
    ])],
    ["ChaseApostate_OnFoot_Road", new Map<string,[string, () => void]>([
      ["CATCH", ["ChaseApostate_OnFoot_Caught", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Road", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Sidewalk", new Map<string,[string, () => void]>([
      ["CATCH", ["ChaseApostate_OnFoot_Caught", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Sidewalk", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught", new Map<string,[string, () => void]>([
      ["KILL", ["ChaseApostate_OnFoot_Caught_Kill", () => {
        (State.variables as any).apostateKidnappersKilled = 1
      }]],
      ["SUBDUE", ["ChaseApostate_OnFoot_Caught_Subdue", () => {}]],
      ["NEGOTIATE", ["ChaseApostate_OnFoot_Caught_Negotiate", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught_Kill", new Map<string,[string, () => void]>([
      ["FIGHT", ["ChaseApostate_OnFoot_Caught_Kill_2", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Kill", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught_Kill_2", new Map<string,[string, () => void]>([
      ["FIGHT", ["ChaseApostate_OnFoot_Caught_Kill_Shoot", () => {
        (State.variables as any).apostateKidnappersKilled = 4
      }]],
      ["NEGOTIATE", ["ChaseApostate_OnFoot_Caught_Kill_Deescalate", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Kill", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught_Kill_Shoot", new Map<string,[string, () => void]>([
      ["CHASE_END", ["ChaseApostate_End", () => {
        (State.variables as any).apostateCaughtKidnappers = true
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Kill_Shoot", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_Caught_Kill_Deescalate", new Map<string,[string, () => void]>([
      ["CHASE_END", ["ChaseApostate_End", () => {
        (State.variables as any).apostateCaughtKidnappers = true
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Kill_Deescalate", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_Caught_Subdue", new Map<string,[string, () => void]>([
      ["FIGHT", ["ChaseApostate_OnFoot_Caught_Subdue_2", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Subdue", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught_Subdue_2", new Map<string,[string, () => void]>([
      ["FIGHT", ["ChaseApostate_OnFoot_Caught_Subdue_Fight", () => {}]],
      ["NEGOTIATE", ["ChaseApostate_OnFoot_Caught_Subdue_Negotiate", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Subdue", () => {}]], /* TODO */
    ])],
    ["ChaseApostate_OnFoot_Caught_Subdue_Fight", new Map<string,[string, () => void]>([
      ["CHASE_END", ["ChaseApostate_End", () => {
        (State.variables as any).apostateCaughtKidnappers = true
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Subdue_Fight", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_Caught_Subdue_Negotiate", new Map<string,[string, () => void]>([
      ["CHASE_END", ["ChaseApostate_End", () => {
        (State.variables as any).apostateCaughtKidnappers = true
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_Caught_Subdue_Negotiate", () => {}]],
    ])],
    // ########################################################################
    // # 911                                                                  #
    // ########################################################################
    ["ChaseApostate_911", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseApostate_911_Tiger", () => {}]],
      ["KING", ["ChaseApostate_911_King", () => {
        (State.variables as any).apostateCanReportKing = false;
      }]],
      ["NONE", ["ChaseApostate_911_End", () => {}]],
      ["FREEZE", ["ChaseApostate_911", () => {}]],
    ])],
    ["ChaseApostate_911_King", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseApostate_911_Tiger", () => {
        (State.variables as any).called911 = true;
      }]],
      ["NONE", ["ChaseApostate_911_End", () => {}]],
      ["FREEZE", ["ChaseApostate_911_King", () => {}]],
    ])],
    ["ChaseApostate_911_Tiger", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseApostate_911_Tiger_2", () => {}]],
      ["KING", ["ChaseApostate_911_Tiger_King", () => {
        (State.variables as any).apostateCanReportKing = false;
      }]],
      ["NONE", ["ChaseApostate_911_End", () => {}]],
      ["FREEZE", ["ChaseApostate_911_Tiger", () => {}]],
    ])],
    ["ChaseApostate_911_Tiger_King", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseApostate_911_Tiger_2", () => {}]],
      ["NONE", ["ChaseApostate_911_End", () => {}]],
      ["FREEZE", ["ChaseApostate_911_Tiger_King", () => {}]],
    ])],
    ["ChaseApostate_911_Tiger_2", new Map<string,[string, () => void]>([
      ["KING", ["ChaseApostate_911_Tiger_2_King", () => {
        (State.variables as any).apostateCanReportKing = false;
      }]],
      ["NONE", ["ChaseApostate_911_End", () => {}]],
      ["FREEZE", ["ChaseApostate_911_Tiger_2", () => {}]],
    ])],
    ["ChaseApostate_911_Tiger_2_King", _apostateChristiesRouting],
    ["ChaseApostate_911_End", _apostateChristiesRouting],
    // ########################################################################
    // # CAR                                                                  #
    // ########################################################################
    ["ChaseApostate_Car", new Map<string,[string, () => void]>([
      ["EXIT", ["ChaseApostate_Christies", () => {}]], /* TODO: "what did you last do" */
      ["FREEZE", ["ChaseApostate_Car", () => {}]], /* TODO: explainer line? */
    ])],
    ["ChaseApostate_King", new Map<string,[string, () => void]>([
      ["BAR", ["ChaseApostate_King_Bar", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "FIRST_AID";
      }]],
      ["LEAVE", ["ChaseApostate_King_Leave", () => {}]],
      ["FREEZE", ["ChaseApostate_King", () => {}]],
    ])],
    ["ChaseApostate_King_Bar", _apostateChristiesRouting],
    ["ChaseApostate_King_Leave", _apostateChristiesRouting],
    // Ebi's Bar options all conclude with Christie's options
    ["ChaseApostate_Bar", new Map<string,[string, () => void]>([
      ..._apostateChristiesRouting,
      ...new Map<string,[string, () => void]>([
        ["PREVENT", ["ChaseApostate_Bar_Prevent", () => {
          (State.variables as any).calledFrancis = true;
          (State.variables as any).bartenderAction = "FIRST_AID";
          (State.variables as any).cookAction = "PET_CLINIC";
        }]],
        ["TREAT", ["ChaseApostate_Bar_Treat", () => {
          (State.variables as any).bartenderAction = "FIRST_AID";
          (State.variables as any).cookAction = "FIRST_AID";
        }]],
        ["ALLOW", ["ChaseApostate_Bar_Allow", () => {
          // TODO: Vary the lockout message
          (State.variables as any).apostateCanCall911 = false;
          (State.variables as any).called911 = true;
          (State.variables as any).bartenderAction = "FIRST_AID";
          (State.variables as any).cookAction = "911";
        }]],
        ["FREEZE", ["ChaseApostate_Bar", () => {}]], /* TODO: explainer line? */
      ])
    ])],
    ["ChaseApostate_Bar_Prevent", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Treat", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Allow", _apostateChristiesRouting],
  ])

  const _faithfulChristiesRouting = new Map<string,[string, () => void]>([
    ["FOOT", ["ChaseFaithful_OnFoot", () => {}]],
    ["911", ["ChaseFaithful_911", () => {
      (State.variables as any).faithfulCanCall911 = false
    }]],
    ["FRANCIS", ["ChaseFaithful_Francis", () => {
      (State.variables as any).faithfulCanCallFrancis = false
    }]],
    ["CAR", ["ChaseFaithful_Car", () => {
      (State.variables as any).faithfulAlreadyTriedDriving = true
    }]],
    ["KING", ["ChaseFaithful_King", () => {}]],
    ["BAR", ["ChaseFaithful_Bar", () => {
      (State.variables as any).bartenderAction = "TALK";
      (State.variables as any).cookAction = "TALK";
    }]],
    ["CHASE_END", ["ChaseFaithful_End", () => {}]],
    ["FREEZE", ["ChaseFaithful_Christies", () => {}]],
  ])

  const _faithfulRoutingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseFaithful_Christies", _faithfulChristiesRouting],
    ["ChaseFaithful_OnFoot", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseFaithful_OnFoot_2", () => {}]],
      ["BACK", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseFaithful_OnFoot", () => {}]],
    ])],
    ["ChaseFaithful_OnFoot_2", new Map<string,[string, () => void]>([
      ["BACK", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseFaithful_OnFoot_2", () => {}]],
    ])],
    // ########################################################################
    // # 911                                                                  #
    // ########################################################################
    ["ChaseFaithful_911", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger", () => {
        (State.variables as any).faithfulReportedTiger = true;
        (State.variables as any).called911 = true;
      }]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger_2", () => {}]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_2";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_Tiger", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_2", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_3", () => {}]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_3";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_Tiger_2", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_3", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_4", () => {}]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_4";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_Tiger_3", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_4", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_5", () => {}]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_Tiger_4", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_5", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_6", () => {}]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_Tiger_5", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_6", _faithfulChristiesRouting],
    ["ChaseFaithful_911_Tiger_Bartender", _faithfulChristiesRouting],
    ["ChaseFaithful_911_King", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger", () => {}]],
      ["TIGER_2", ["ChaseFaithful_911_Tiger_2", () => {}]],
      ["TIGER_3", ["ChaseFaithful_911_Tiger_3", () => {}]],
      ["TIGER_4", ["ChaseFaithful_911_Tiger_4", () => {}]],
      ["NONE", ["ChaseFaithful_911_End_Call", () => {}]],
      ["FREEZE", ["ChaseFaithful_911_King", () => {}]],
    ])],
    ["ChaseFaithful_911_End_Call", _faithfulChristiesRouting],
    // ########################################################################
    // # FRANCIS                                                              #
    // ########################################################################
    ["ChaseFaithful_Francis", new Map<string,[string, () => void]>([
      ["KING", ["ChaseFaithful_Francis_King", () => {
        (State.variables as any).calledFrancis = true;
        (State.variables as any).faithfulCalledFrancis = true;
      }]],
      ["NONE", ["ChaseFaithful_Francis_End_Call_Immediately", () => {}]],
      ["FREEZE", ["ChaseFaithful_Francis", () => {}]],
    ])],
    ["ChaseFaithful_Francis_End_Call_Immediately", _faithfulChristiesRouting],
    ["ChaseFaithful_Francis_King", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_Francis_King_2", () => {}]],
      ["NONE", ["ChaseFaithful_Francis_End_Call_Safely", () => {}]],
      ["FREEZE", ["ChaseFaithful_Francis_King", () => {}]],
    ])],
    ["ChaseFaithful_Francis_King_2", new Map<string,[string, () => void]>([
      ["FOLLOW", ["ChaseFaithful_Francis_King_3", () => {}]],
      ["NONE", ["ChaseFaithful_Francis_End_Call_Safely", () => {}]],
      ["FREEZE", ["ChaseFaithful_Francis_King_2", () => {}]],
    ])],
    ["ChaseFaithful_Francis_King_3", new Map<string,[string, () => void]>([
      ["FOLLOW", ["ChaseFaithful_Francis_King_4", () => {}]],
      ["NONE", ["ChaseFaithful_Francis_End_Call_Safely", () => {}]],
      ["FREEZE", ["ChaseFaithful_Francis_King_3", () => {}]],
    ])],
    ["ChaseFaithful_Francis_King_4", _faithfulChristiesRouting],
    ["ChaseFaithful_Francis_End_Call_Safely", _faithfulChristiesRouting],
    // ########################################################################
    // # CAR                                                                  #
    // ########################################################################
    ["ChaseFaithful_Car", new Map<string,[string, () => void]>([
      ["DRIVE", ["ChaseFaithful_Car_Drive", () => {}]],
      ["WAIT",["ChaseFaithful_Car_Wait", () => {}]],
      ["EXIT", ["ChaseFaithful_Car_Exit", () => {}]],
      ["FREEZE", ["ChaseFaithful_Car", () => {}]],
    ])],
    ["ChaseFaithful_Car_Drive", new Map<string,[string, () => void]>([
      ..._faithfulChristiesRouting,
      ...new Map<string,[string, () => void]>([
        ["DRIVE", ["ChaseFaithful_Car_Drive_2", () => {}]],
        ["FREEZE", ["ChaseFaithful_Car_Drive", () => {}]],
      ])])
    ],
    ["ChaseFaithful_Car_Drive_2", new Map<string,[string, () => void]>([
      ["ACCELERATE", ["ChaseFaithful_Car_Drive_Accelerate", () => {}]],
      ["LEFT", ["ChaseFaithful_Car_Drive_Left", () => {}]],
      ["RIGHT", ["ChaseFaithful_Car_Drive_Right", () => {}]],
      ["BRAKE", ["ChaseFaithful_Car_Drive_Brake", () => {}]],
      ["FREEZE", ["ChaseFaithful_Car_Drive_Manslaughter", () => {}]],
    ])],
    ["ChaseFaithful_Car_Drive_Accelerate", new Map<string,[string, () => void]>([
      ["FREEZE", ["ChaseFaithful_Car_Drive_Manslaughter", () => {}]],
    ])],
    ["ChaseFaithful_Car_Drive_Right", new Map<string,[string, () => void]>([
      ["FREEZE", ["ChaseFaithful_Car_Drive_Right", () => {}]],
    ])],
    ["ChaseFaithful_Car_Drive_Left", new Map<string,[string, () => void]>([
      ["RAM", ["ChaseFaithful_Car_Drive_Ram", () => {}]],
      ["CUT_OFF", ["ChaseFaithful_Car_Drive_CutOff", () => {}]],
      ["FREEZE", ["ChaseFaithful_Car_Drive_Left", () => {}]],
    ])],
    ["ChaseFaithful_Car_Drive_Brake", new Map<string,[string, () => void]>([
      ["RAM", ["ChaseFaithful_Car_Drive_Ram", () => {}]],
      ["CUT_OFF", ["ChaseFaithful_Car_Drive_CutOff", () => {}]],
      ["FREEZE", ["ChaseFaithful_Car_Drive_Brake", () => {}]],
    ])],
    ["ChaseFaithful_Car_Wait", new Map<string,[string, () => void]>([
      ["DRIVE", ["ChaseFaithful_Car_Drive", () => {}]],
      ["WAIT",["ChaseFaithful_Car_Wait_2", () => {}]],
      ["EXIT", ["ChaseFaithful_Car_Exit", () => {}]],
      ["FREEZE", ["ChaseFaithful_Car_Wait", () => {}]],
    ])],
    ["ChaseFaithful_Car_Exit", _faithfulChristiesRouting],
    // ########################################################################
    // # KING                                                                 #
    // ########################################################################
    ["ChaseFaithful_King", new Map<string,[string, () => void]>([
      ["TREAT", ["ChaseFaithful_King_Treat", () => {}]],
      ["IMPROVISE", ["ChaseFaithful_King_Improvise", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        // The cook vanishes here, to avoid conflict with Ebi.
      }]],
      ["LEAVE", ["ChaseFaithful_King_Leave_Immediately", () => {}]],
      ["FREEZE", ["ChaseFaithful_King", () => {}]],
    ])],
    ["ChaseFaithful_King_Leave_Immediately", _faithfulChristiesRouting],
    ["ChaseFaithful_King_Improvise", new Map<string,[string, () => void]>([
      ["CONTINUE", ["ChaseFaithful_King_Treat", () => {}]],
      ["LEAVE", ["ChaseFaithful_King_Leave_Dangerously", () => {
        (State.variables as any).faithfulCanTriageKing = false
      }]],
      ["FREEZE", ["ChaseFaithful_King_Improvise", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat", new Map<string,[string, () => void]>([
      ["BACK", ["ChaseFaithful_King_Treat_Back", () => {
        (State.variables as any).faithfulKingBackTreated = true
      }]],
      ["LEG", ["ChaseFaithful_King_Treat_Leg", () => {
        (State.variables as any).faithfulKingLegTreated = true
      }]],
      ["LEAVE", ["ChaseFaithful_King_Leave_Dangerously", () => {
        (State.variables as any).faithfulCanTriageKing = false
      }]],
      ["FREEZE", ["ChaseFaithful_King_Treat", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat_Back", new Map<string,[string, () => void]>([
      ["LEG", ["ChaseFaithful_King_Treat_Leg", () => {
        (State.variables as any).faithfulKingLegTreated = true
      }]],
      ["ROLL", ["ChaseFaithful_King_Treat_Roll", () => {}]],
      ["LEAVE", ["ChaseFaithful_King_Leave_Dangerously", () => {
        (State.variables as any).faithfulCanTriageKing = false
      }]],
      ["FREEZE", ["ChaseFaithful_King_Treat_Back", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat_Leg", new Map<string,[string, () => void]>([
      ["BACK", ["ChaseFaithful_King_Treat_Back", () => {
        (State.variables as any).faithfulKingBackTreated = true
      }]],
      ["ROLL", ["ChaseFaithful_King_Treat_Roll", () => {}]],
      ["LEAVE", ["ChaseFaithful_King_Leave_Dangerously", () => {
        (State.variables as any).faithfulCanTriageKing = false
      }]],
      ["FREEZE", ["ChaseFaithful_King_Treat_Leg", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat_Roll", new Map<string,[string, () => void]>([
      ["ROLL", ["ChaseFaithful_King_Treat_Belly", () => {}]],
      ["FREEZE", ["ChaseFaithful_King_Treat_Roll", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat_Belly", new Map<string,[string, () => void]>([
      ["STABLE", ["ChaseFaithful_King_Treat_Stable", () => {
        (State.variables as any).faithfulKingIsStable = true
      }]],
      ["FREEZE", ["ChaseFaithful_King_Treat_Belly", () => {}]],
    ])],
    ["ChaseFaithful_King_Treat_Stable", _faithfulChristiesRouting],
    ["ChaseFaithful_King_Leave_Dangerously", _faithfulChristiesRouting],
    // ########################################################################
    // # BAR                                                                  #
    // ########################################################################
    ["ChaseFaithful_Bar", new Map<string,[string, () => void]>([
      ["PET", ["ChaseFaithful_Bar_Pet", () => {
        // TODO: Vary the lockout message
        (State.variables as any).faithfulCanCallFrancis = false;
        (State.variables as any).calledFrancis = true;
        (State.variables as any).cookAction = "PET_CLINIC"
      }]],
      ["TREAT", ["ChaseFaithful_Bar_Treat", () => {
        (State.variables as any).cookAction = "FIRST_AID"
      }]],
      ["ALLOW", ["ChaseFaithful_Bar_Allow", () => {
        // TODO: Vary the lockout message
        (State.variables as any).faithfulCanCall911 = false;
        (State.variables as any).called911 = true;
        (State.variables as any).cookAction = "911";
      }]],
      ["FREEZE", ["ChaseFaithful_Bar", () => {}]],
    ])],
    ["ChaseFaithful_Bar_Pet", _faithfulChristiesRouting],
    ["ChaseFaithful_Bar_Treat", _faithfulChristiesRouting],
    ["ChaseFaithful_Bar_Allow", _faithfulChristiesRouting],
  ])

  
})()