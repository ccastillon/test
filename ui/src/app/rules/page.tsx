export default function RulesPage() {
  return (
    <>
      <header>
        <div className="px-20 text text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
          <div className="container z-1 text-justify pt-16">
            <h1 className="mb-4 text-5xl font-bold text-slate-750">Rules</h1>
            <h5 className="mb-0 font-light">
              Below are the rules you need to adhere when signing up to
              FTBookie.
            </h5>
          </div>
        </div>
      </header>

      <div className="py-10 px-5 lg:columns-2 sm:columns-1 auto-cols-max gap-x-50 items-bottom mx-10">
        <ol className="leading-relaxed list-outside list-decimal space-y-5 text-justify">
          <li>
            Minimum Age. If you&#39;re not 18 or older, then you are not
            playing, and before you start, I know you can join the army at 17,
            but tbh, if it was up to us, you&#39;d not be allowed to do that
            either.
          </li>
          <li>
            Maximum Limit. We know gambling can be a problem for some, so we all
            need to set a limit.
          </li>
          <li>
            No credit cards. If don&#39;t have the money to play then don&#39;t
            borrow it, either treat it like you&#39;re on the bench and just
            watch this week or simply bet what you can afford.
          </li>
          <li>
            No hounding. If you want to play then play, if you don&#39;t, then
            don&#39;t. We are not going to chase you with offers of free bets,
            not because we don&#39;t love you but because we respect your
            choice.
          </li>
          <li className="pt-2">
            We keep it simple, so there is no debate over who wins. When you get
            beat you need to release the funds for the winner. Any breach of
            trust will result in yellow cards, 2 of them and you are off.
          </li>
          <li>
            Any disagreement you can raise an appeal where the referee&#39;s
            decision is final.
          </li>
          <li>
            You rate the speed of response from losers. If you&#39;re slow on
            the turn then you can expect a poor rating, enough of them and you
            will find yourself in the stands with nobody to play with.
          </li>
          <li>Please review and agree with our cookies and GDPR policies.</li>
        </ol>
      </div>
    </>
  );
}
