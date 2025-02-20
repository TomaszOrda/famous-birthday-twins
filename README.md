﻿# Your most famous birthday twin

There is no specific purpose to this project. Just a sense of curiosity. I sometimes happen to remember dates of births of some people, by remembering a famous person that was born on that day. However finding such a person is not always an easy task. 
One could assume a list of most important people (obtaining that list seems to be nontrivial, but we will lift that assumption later). How long would the list have to be to cover all days of the year?

## Covering 365 days in year with random birth dates

Let's assume for now, that a year has always 365 days. It will greatly reduce the complexity of calculations. More so there is little chance of having a friend that was born on 29th February.

We know that after obtaining the first birthdate we will surely have $1$ day covered. Second birthdate will most likely cover a second day, unless it is the same as the first ($1$ in $365$ chance) — then we will have to try again.

In general, if we covered $n$ out of $365$ days, we have a $\frac{n}{365}$ chance it will be the same as any previously seen.

Using that we can infer the expected number of tries until another day is covered. Assume $n$ as above. We will get another day in one try with probability $\frac{365 - n}{365}$. In two tries if we fail the first $\frac{n}{365}$ and succeed at the second $\frac{365 - n}{365}$. In three tries if we fail twice and succeed once: $\frac{365-n}{365}\left(\frac{n}{365}\right)^2\text{.}$ And finally for $i$ tries $\frac{365-n}{365}\left(\frac{n}{365}\right)^{i-1}\text{.}$

Note that we do not use Bernoulli distribution. We are not expecting one hit in $i$ tries, but $i-1$ fails and then a hit. That is why there is no binomial coefficient. In fact it is (slightly less known) geometric distribution (to be precise shifted geometric distribution, because we count all the failures and an additional one for success). Thus the following calculation is basically deriving the expected value of this distribution in this specific scenario. General calculations might have been slightly easier. However that would be less natural and somewhat harder to understand.

Expected number of tries when $n$ days are already covered is then calculated by $`E_n =\sum_{i=1}^\infty i* p_n(i)`$ where $p_n(i)$ is the probability we just calculated. Applying that to the equation, and applying geometric sum formula, we get:
$`E_n = \sum_{i=1}^\infty i*\frac{365-n}{365}\left(\frac{n}{365}\right)^{i-1} = \frac{365-n}{365}\sum_{i=1}^\infty i*\left(\frac{n}{365}\right)^{i-1} =\frac{365-n}{365}\sum_{j=1}^\infty\sum_{i=j}^\infty \left(\frac{n}{365}\right)^{i-1} =\frac{365-n}{365}\sum_{j=1}^\infty \frac{\left(\frac{n}{365}\right)^{j-1}}{1- \frac{n}{365}} =\sum_{j=1}^\infty \left(\frac{n}{365}\right)^{j-1} =\frac{1}{1-\frac{n}{365}} = \frac{365}{365-n}\text{.}`$

Now we only need to calculate the total number of random birthdays until the full year is covered. We will sum up the tries until the first day is covered and second is covered, third and so on.
$E = \sum_{i=0}^{364} E_i = \sum_{i=0}^{364} \frac{365}{365-i} = 365\sum_{i=0}^{364} \frac{1}{365-i} = 365\sum_{i=1}^{365} \frac{1}{i} =365H_{365} \approx 365*6.48 \approx 2365$
Where $H_n$ is a harmonic number. It can be calculated directly or approximated: $H_n\in\Theta(\ln(n))$.

That finished our calculations. We need a list of about $2365$ random birthdays on average to cover the whole $365$ days.

Also, the general version of this problem has a name. It is the coupon collector problem.

## Covering 366 days in year with random birth dates

Naturally ever so often a year has $366$ days. And one of those days is four times less likely to appear than others. This complicates calculations **and** changes the results (somewhat) significantly. That is because we might have to wait a significant amount of time for the 29th of February. 

Here, basic knowledge of the coupon collector problem is not enough. By applying Monte Carlo method the result was $2666$ random birthdays on average.

Let's denote $\forall_{0<i<366} \ p_i = \frac{4}{1461}$ probability of randomly choosing a normal day, and $p_{366} = \frac{4}{1461}$ the probability of getting 29th February.

To calculate the expected value, we will use the result from [[Ferrante and Frigo, 2014]](https://www.researchgate.net/publication/232028148_A_note_on_the_coupon_-_collector's_problem_with_multiple_arrivals_andthe_random_sampling#pfe):

<!-- Short version of the proof-->

$E = \sum_{m=1}^{366} (-1)^{m-1}\sum_{0 < i_1 < i_2 <...<i_m \leq 366} \frac{1}{\sum_k p_{i_k}}\text{.}$

We can divide the inner sum into one containing probability of getting 29th February, and one not containing it. Then replacing probabilities with adequate values.

$E = \sum_{m=1}^{366} (-1)^{m-1} ( \sum_{0 < i_1 < i_2 <...<i_m <366} \frac{1}{\sum_k \frac{4}{1461}} + \sum_{0 < i_2 <...<i_m<366} \frac{1}{\sum_k \frac{4}{1461} + \frac{1}{1461}} )$

By collapsing the inner sums into multiplications we ge:

$E = \sum_{m=1}^{366} (-1)^{m-1} ( \binom{366}{m} \frac{1461}{4m} + \binom{366}{m-1} \frac{1461}{4m - 3} )\text{.}$

This should be enough, however due to the sheer amount of divisions, and sizes of binomial coefficients, the numerical error gets quite substantial. In order to alleviate that one should use, for example, fractions. The final equals about 2670 days.

<!--
expected_value = sum(
    (-1)**(m-1) * 1461 * (comb(365, m-1)/Fraction(4*m - 3) + comb(365, m)/Fraction(4*m))
    for m in range(1, 365+1)
)
-->

## Obtaining a birthday list of the most famous 

Wikipedia is a pretty straightforward idea. Yet there is also Wikidata, which seems to be a better choice (native support for queries in SPARQL without scraping). That is what was used.

The SPARQL query should look as follows.

```
SELECT DISTINCT ?item ?itemLabel ?linkcount ?birthday WHERE
{
	?item p:P31 ?statement0.
	?statement0 (ps:P31/(wdt:P279*)) wd:Q5.
	?item wdt:P569 ?birthday.
	FILTER(LANG(?itemLabel) = "en")      # Ensure label is in English
	?item rdfs:label ?itemLabel.
	?item wikibase:sitelinks ?linkcount .
	SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY desc(?linkcount)
LIMIT 8000
```   
 However there is another problem. `P31Q5` is very big and Wikidata query service limits every query to one minute. It would be possible — having of course enough computational power — to download wikidata dump and run the query. I could not do that. Instead the first part of the query is as follows
 
```
	?item p:P106 ?statement0.
	?statement0 (ps:P106/(wdt:P279*)) wd:Q901.
```
 
 Which takes all records with given occupation. Here the occupation is `Q901` which means a scientist.
 
Usually that is still not enough. `/(wdt:P279*)` is also expensive. Getting rid of this part might reduce the results by every record that is not marked scientist, but with a specific scientific occupation (for example a astrologist, that was not marked a scientist for any reason).

Naturally it creates a problem of finding every possible occupation that a famous person might have. Because of that, data provided by this version is very much not complete. The occupations used are `Q901, Q82955, Q4964182, Q170790, Q201788, Q483501, Q188094, Q55092, Q482980, Q1930187, Q169470, Q593644, Q36834, Q42973, Q40348, Q662729, Q211236, Q4991371, Q189290, Q4504549, Q116, Q1251441, Q15995642, Q29182, Q639669, Q55631411`.

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
