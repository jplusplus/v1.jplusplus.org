2 years ago, we bootstraped a small tool to check your data for compliance to Benford's law. As we looked through our analytics the other day, we noticed the tool was still quite popular, so we decided to redo it from the ground up. Better, stronger and more precise.

** It's now live at [benford.jplusplus.org](http://benford.jplusplus.org) ** thanks to amazing coding by [paulloz](https://twitter.com/pauljoannon), the newest nerd at Journalism++.

## Benford's law lets you spot fraudsters

Frank Benford was a physicist who noticed that in real life, numbers tend to start more often with a 1 than with a 2, more often with a 2 than with a 3, and so on. About 30% of numbers start with a 1, for instance, and only 4.6% with a 9. If a dataset doesn't follow this law, it might hint at a form of manipulation.

Tax recovery services like the IRS, for instance, use [Benford's Law](http://en.wikipedia.org/wiki/Benford%27s_law) to raise flags on suspicious tax filings. It has been used in court to prove fraudulent accounting.

This law is not foolproof. It requires that your data spans several orders of magnitude, e.g. that it goes from 1 to 1000, or from millions to billions. It doesn't work if you work with percentages, for instance, or with heights. It also requires that your data represents a measurement of something. If you deal with a series of given numbers, like invoice numbers, Benford's law doesn't apply.

<iframe src="http://benford.jplusplus.org/checker/52416b9a3a7b2c0200000001/chart" frameborder="0" allowtransparency="true" width="100%" height="585"></iframe>

## Journalism++ gives you the best Benford's law checker

Until now, you had to use an Excel macro or a programming language to check for compliance with Benford's law. [Benford.jplusplus.org](http://benford.jplusplus.org) lets you paste or upload your data and gives you a result in a fraction of a second.

We use a **z-stat** to check if the difference between your data and Benford's law can be due to chance. If it's over 2.57, it means that we're 99% sure that the distribution doesn't follow the expected distribution.  The app also checks for the **orders of magnitude**. If your data doesn't span enough of them, a message alerts you. Check out the [F.A.Q.](https://github.com/jplusplus/benford-calculator/wiki/Frequently-Asked-Questions) for more.

If your data tests positive, don't jump to conclusions. You still need to use other methods of investigation!
