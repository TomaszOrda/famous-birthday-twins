# Your most famous birthday twin

There is no specific purpose to this project. Just a sense of curiosity. I sometimes happen to remember dates of births of some people, by remembering a famous person that was born on that day. However finding such a person is not always an easy task. 
One could assume a list of most important people (obtaining that list seems to be nontrivial, but we will lift that assumption later). How long would the list have to be to cover all days of the year?

## Covering 365 days in year with random birth dates

Let's assume for now, that a year has always 365 days. It will greatly reduce the complexity of calculations. More so there is little chance of having a friend that was born on 29th February.

We know that after obtaining the first birthdate we will surely have $1$ day covered. Second birthdate will most likely cover a second day, unless it is the same as the first ($1$ in $365$ chance) — then we will have to try again.

In general, if we covered $n$ out of $365$ days, we have a $\frac{n}{365}$ chance it will be the same as any previously seen.

Using that we can infer the expected number of tries until another day is covered. Assume $n$ as above. We will get another day in one try with probability $\frac{365 - n}{365}$. In two tries if we fail the first $\frac{n}{365}$ and succeed at the second $\frac{365 - n}{365}$. In three tries if we fail twice and succeed once: $\frac{365-n}{365}\left(\frac{n}{365}\right)^2\text{.}$ And finally for $i$ tries $\frac{365-n}{365}\left(\frac{n}{365}\right)^{i-1}\text{.}$

Note that we do not use Bernoulli distribution. We are not expecting one hit in $i$ tries, but $i-1$ fails and then a hit. That is why there is no binomial coefficient. In fact it is (slightly less known) geometric distribution (to be precise shifted geometric distribution, because we count all the failures and an additional one for success). Thus the following calculation is basically deriving the expected value of this distribution in this specific scenario. General calculations might have been slightly easier. However that would be less natural and somewhat harder to understand.

Expected number of tries when $n$ days are already covered is then calculated by $E_n =\sum_{i=1}^\infty i*p_n(i)$ where $p_n(i)$ is the probability we just calculated. Applying that to the equation, and applying geometric sum formula, we get:
$E_n = \sum_{i=1}^\infty i*\frac{365-n}{365}\left(\frac{n}{365}\right)^{i-1} = \frac{365-n}{365}\sum_{i=1}^\infty i*\left(\frac{n}{365}\right)^{i-1} =\frac{365-n}{365}\sum_{j=1}^\infty\sum_{i=j}^\infty \left(\frac{n}{365}\right)^{i-1} =\frac{365-n}{365}\sum_{j=1}^\infty \frac{\left(\frac{n}{365}\right)^{j-1}}{1- \frac{n}{365}} =\sum_{j=1}^\infty \left(\frac{n}{365}\right)^{j-1} =\frac{1}{1-\frac{n}{365}} = \frac{365}{365-n}\text{.}$

Now we only need to calculate the total number of random birthdays until the full year is covered. We will sum up the tries until the first day is covered and second is covered, third and so on.
$E = \sum_{i=0}^{364} E_i = \sum_{i=0}^{364} \frac{365}{365-i} = 365\sum_{i=0}^{364} \frac{1}{365-i} = 365\sum_{i=1}^{365} \frac{1}{i} =365H_{365} \approx 365*6.48 \approx 2365$
Where $H_n$ is a harmonic number. It can be calculated directly or approximated: $H_n\in\Theta(\ln(n))$.

That finished our calculations. We need a list of about $2365$ random birthdays on average to cover the whole $365$ days.

Also, the general version of this problem has a name. It is the coupon collector problem.

## Covering 366 days in year with random birth dates

The calculation is quite involved. I have not figured a good way of calculating it, that I could show here. It is something I would like to include one day.

By applying Monte Carlo method this problem finished on average after $2666$ random birthdays.

Basic knowledge about the coupon collector problem does not seem to solve this in any straightforward way either.

**TODO**

<!---
Naturally ever so often a year has $366$ days. And one of those days is four times less likely to appear than others. This complicates calculations **and** changes the results significantly. That is because we might have to wait a significant amount of time for the 29th of February. It might not be completely intuitive. Lets follow with calculations.

Probability of getting a normal day is $1$ in $365.25$ or $4$ in $1461$ (four years). $29$th of February has a chance of $1$ in $1461$.

So, probability of getting a new birthdate, after we covered $n$ normal days is $\frac{1461 - 4n}{1461}$. The same probability, but with the leap day among the $n$ covered is $\frac{1461 - (4n - 3)}{1461}$

It seems that we cannot really derive a simple formula. Lets represent the expected value as an average over all the possible positions of leap day in the sequence of covered days. We will not derive the previous formula again — instead use shifted geometric distribution directly. However each position is not equally likely. 

To get likelihood of leap day being covered $n$th we can start with the first few values of $n$. Chance that the first covered day is the leap day is $1$ in $1461$ as it is the first birthday drawn. For leap day being second we need to choose a non leap day first, and then leap day from remaining — $\frac{1460}{1461}\frac{1}{1460}$. Third is $\frac{1460}{1461}\frac{1459}{1460}\frac{1}{1459}$. In general, chance for leap day covering $n$th date in a year is $\frac{1460!/(1461-n)!}{1461!}$

$\frac{1}{366} \sum_{l=0}^{365} \left(\sum_{i=0}^{l}\frac{1461}{1461 - 4i} + \sum_{i=l+1}^{365}\frac{1461}{1461 - (4i - 3)}\right)= 
\frac{1461}{366} \sum_{l=0}^{365} \left(\sum_{i=0}^{l}\frac{1}{1461 - 4i} + \sum_{i=l+1}^{365}\frac{1}{1464 - 4i}\right)= 
\frac{1461}{366} \sum_{l=0}^{365} \left(\sum_{i=0}^{l}\frac{1}{1461 - 4i} + \frac{1}{4}\sum_{i=l+1}^{365}\frac{1}{366 - i}\right)=
\frac{1461}{366} \sum_{l=0}^{365} \left(\sum_{i=0}^{l}\frac{1}{1461 - 4i} + \frac{1}{4}\sum_{i=1}^{365-l}\frac{1}{i}\right)=
\frac{1461}{366} \sum_{l=0}^{365} \left(\sum_{i=0}^{l}\frac{1}{1461 - 4i} + \frac{H_{365-l}}{4}\right)$
Unfortunately the remaining inner sum does not simplify easily. Thus the final formula

$\approx \frac{1461}{366} \left(93.4 + 502\right) \approx 2376,$
after extensive calculations.

It is however not quite right, because conditioning over where leap day is placed is a little bit more complicated. By the power of monte carlo the results should be around2666
--->

## Obtaining a birthday list of the most famous 

Wikipedia is a pretty straightforward idea. Yet there is also Wikidata, which seems to be a better choice (native support for queries in SPARQL without scraping). That is what was used.

The SPARQL query should look as follows.

<code>SELECT DISTINCT ?item ?itemLabel ?linkcount ?birthday WHERE
{
	?item p:P31 ?statement0.
	?statement0 (ps:P31/(wdt:P279*)) wd:Q5.
	?item wdt:P569 ?birthdate.
	FILTER(LANG(?itemLabel) = "en")      # Ensure label is in English
	?item rdfs:label ?itemLabel.
	?item wikibase:sitelinks ?linkcount .
	SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY desc(?linkcount)
LIMIT 8000</code>   
 However there is another problem. <code>P31Q5</code> is very big and Wikidata query service limits every query to one minute. It would be possible — having of course enough computational power — to download wikidata dump and run the query. I could not do that. Instead the first part of the query is as follows
 
 <code>?item p:P106 ?statement0.
?statement0 (ps:P106/(wdt:P279*)) wd:Q901.</code>
 
 Which takes all records with given occupation. Here the occupation is <code>Q901</code> which means a scientist.
 
Usually that is still not enough. <code>/(wdt:P279*)</code> is also expensive. Getting rid of this part might reduce the results by every record that is not marked scientist, but with a specific scientific occupation (for example a astrologist, that was not marked a scientist for any reason).

Naturally it creates a problem of finding every possible occupation that a famous person might have. Because of that, data provided by this version is very much not complete. The occupations used are <code>Q901, Q82955, Q4964182, Q170790, Q201788, Q483501, Q188094, Q55092, Q482980, Q1930187, Q169470, Q593644, Q36834, Q42973, Q40348, Q662729, Q211236, Q4991371, Q189290, Q4504549, Q116, Q1251441, Q15995642, Q29182, Q639669, Q55631411</code>.

The query was limited to 8000. It gives us room for any unlucky lists of birthdays (Chance of not hitting each day is very small), while creating a reasonably sized list for each day.

## Turning query result into browser app readable data

At this point everything gets pretty straightforward. Assume we have one, maybe not sorted, SPARQL query result as a simple JSON.

Now I will quickly go through the code in dataParsing.py

* First few lines load the file and sort the result by *linkcount*. 
* Next we need to remove missing data — birth dates that are links are not valid, and extract day and month from the birth date. Note that when working on a live list, we need to go through it in reverse order. Otherwise we would be shifting indexes that have not yet been visited. 
* Next we will remove duplicates. The results are sorted, so it should be enough to go through the list, and remove any record that is the same as the previous one. This time we use a copy of the list, so there is no need of going in reverse order. There might be a potential problem with records that have the same *linkcount*. A secondary distinct sorting key should have been used.
* For each record in the sorted list, we create a key (being the birthday) and either create a new entry with a list containing the record, or we append the record to an existing list. Each time we create a list, we raise the counter to check our calculations and to be sure that we have covered everything.
* Finally the ready dictionary is written into a file.

Naturally, if we had more than one query, we need to join them together beforehand.

## Problems with the data

Firstly, Wikidata birthdays are not always using the same calendar as Wikipedia. I believe that Wikidata uses the current calendar — which would mean that before adoption of the Gregorian calendar each date would be about 10 days off. And that corresponds with the results. It is not taken into account in the final version. Mayhaps it will be repaired in the future, either by subtracting the days or updating the data.

Secondly, for each record which does not have a specific day (or month) attached — most commonly because it is unknown — the first day (January) will be used. Example being Cleopatra (and Julius Caesar). I do not know of a way to omit those records in Wikidata.

## Design of the app

I designed this app with simplicity in mind. A single page application requiring no specific backend. Having used one HTML, one CSS and one (two if we count the data in) JS file the architecture is rudimentary and can be easily opened offline using only a browser. Despite the lack of tools, oftentimes crucial for web development, it was the option for an app as simple as this one. Thanks to that it can be [hosted using GitHub Pages](https://tomaszorda.github.io/famous-birthday-twins/).

Simple three color palette was used. Layout of the page was supposed to resemble a simplified Wikipedia article.
