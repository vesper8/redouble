type options = [%bs.obj: {.
  target: int,
  solutions: int,
  mode: int
}];

type deal = [%bs.obj: {.
  trump: int,
  first: int,
  currentTrickRank: array(int),
  currentTrickSuit: array(int),
  remainCards: string
}];

type solution = [%bs.obj: {.
  nodes: int,
  cards: int,
  suit: array(int),
  rank: array(int),
  equals: array(int),
  score: array(int)
}];

[@bs.module "dds-node-adapter"] external solveBoard : (deal, options) => Js.Promise.t(solution) = "solveBoard";

[@bs.module "dds-node-adapter"] external north : int = "HAND_NORTH";
[@bs.module "dds-node-adapter"] external east : int = "HAND_EAST";
[@bs.module "dds-node-adapter"] external south : int = "HAND_SOUTH";
[@bs.module "dds-node-adapter"] external west : int = "HAND_WEST";

[@bs.module "dds-node-adapter"] external spades : int = "SUIT_SPADES";
[@bs.module "dds-node-adapter"] external hearts : int = "SUIT_HEARTS";
[@bs.module "dds-node-adapter"] external diamonds : int = "SUIT_DIAMONDS";
[@bs.module "dds-node-adapter"] external clubs : int = "SUIT_CLUBS";
[@bs.module "dds-node-adapter"] external notrumps : int = "SUIT_NOTRUMPS";

[@bs.module "dds-node-adapter"] external solution_one : int = "SOLUTION_ONE";
[@bs.module "dds-node-adapter"] external solution_all : int = "SOLUTION_ALL";
[@bs.module "dds-node-adapter"] external solution_full : int = "SOLUTION_FULL";

[@bs.module "dds-node-adapter"] external target_maximum : int = "TARGET_MAXIMUM";
[@bs.module "dds-node-adapter"] external target_zero : int = "TARGET_ZERO";
[@bs.module "dds-node-adapter"] external target_full : int = "TARGET_FULL";

[@bs.module "dds-node-adapter"] external mode_auto_nosearch : int = "MODE_AUTO_NOSEARCH";
[@bs.module "dds-node-adapter"] external mode_auto_search : int = "MODE_AUTO_SEARCH";
[@bs.module "dds-node-adapter"] external mode_always : int = "MODE_ALWAYS";

