include Bid;

external require : string => unit = "require" [@@bs.val];
require ("ui/table/biddingBox.css");

let component = ReasonReact.statelessComponent "BiddingBox";

let make ::makeBid _children => {
  let renderButton bid => {
    let className = "bidding-box-button pure-button bid-" ^ (Bid.name bid);

    <button className
          key=(Bid.name bid)
          onClick=(fun (_) => makeBid(bid))>
      <BidComponent bid />
    </button>;
  };

  {
    ...component,
    render: fun _self => {
      /* buid a 2d array containing all the bids in their rows */
      let callRows = [1, 2, 3, 4, 5, 6, 7] |> List.map (fun level => {
        BidSuit.all |> List.map (fun suit => Bid.Call level suit);
      });

      let bidRows = callRows @ [[ Double, Redouble, NoBid ]];

      /* convert them into buttons */
      let buttonRows = bidRows |>
        List.map (fun bidRow => List.map renderButton bidRow);

      /* and wrap each row in a div */
      let rows = buttonRows |>
        List.mapi (fun idx buttonRow => {
          <div key=(string_of_int idx) className="bidding-box-row">
            (ReasonReact.arrayToElement(Array.of_list buttonRow))
          </div>;
        });

      <div className="bidding-box-container">
        (ReasonReact.arrayToElement(Array.of_list rows))
      </div>;
    }
  };
};