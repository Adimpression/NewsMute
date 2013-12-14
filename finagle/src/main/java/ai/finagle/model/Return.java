package ai.finagle.model;

/**
 * {
 "returnStatus": "",
 "returnValue": {
 "data": [
 {
 "link": "http://www.channelnewsasia.com/news/singapore/lawrence-wong-welcomes/856090.html",
 "title": "The earth was found round",
 "description": "While one scientist was digging a well in his home, he realized that his well showed the sky. Hence he deduced the earth is round."
 },
 {
 "link": "http://www.channelnewsasia.com/news/singapore/former-straits-times/854952.html",
 "title": "There was a cat on the sync which was leaking",
 "description": "Lately, people have been speculating over the curious incident where a cat was sitting on sync which had a leaking tap. This behaviour is considered to be extremely rare as cats do not like water!"
 },
 {
 "link": "http://www.todayonline.com/singapore/smrt-introduce-600-environmentally-friendly-prius-taxis",
 "title": "Finally, Mars needs water",
 "description": "On the contrary to popular believe that Mars contains water, scientists now believe Mars is a giant sponge and if we happen to go there to get water out of it, we might as well be sucked off of our water!"
 },
 {
 "link": "http://www.kansascity.com/2013/10/21/4566887/european-world-cup-playoffs-draw.html",
 "title": "Fake lion",
 "description": "A 21 year old young kid has been arrested for scaring a 11 year old kid by pretending to be a Lion. Apparently, the 11 year old freaked and smashed a pan over his own head to put himself out of the misery."
 },
 {
 "link": "http://adimpression.mobi",
 "title": "Judge found bribing a judge",
 "description": "For the first time in recorded history, today a judge made a historical record. He had bribed another judge. This has never happen before. This act is also considered now as the stupidest act ever done by a mature adult."
 }
 ]

 },
 "returnError": ""
 };
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:43 PM
 */
public class Return<T extends ReturnValue> {
    public final T returnValue;
    public final String returnError;
    public final String returnStatus;

    public Return(final T returnValue, final String returnError, final String returnStatus) {
        this.returnValue = returnValue;
        this.returnError = returnError;
        this.returnStatus = returnStatus;
    }
}
