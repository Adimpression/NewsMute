package ai.newsmute.service;

import twitter4j.*;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 30/12/14
 * Time: 12:18 AM
 */
public class Influencer {

    public static void main(String[] args) throws TwitterException, IOException {

        // The factory instance is re-useable and thread safe.
        Twitter twitter = TwitterFactory.getSingleton();

        twitter.setOAuthConsumer("WRONG", "WRONG");

        RequestToken requestToken = twitter.getOAuthRequestToken();

        AccessToken accessToken = null;

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        while (null == accessToken)

        {
            System.out.println("Open the following URL and grant access to your account:");
            System.out.println(requestToken.getAuthorizationURL());
            System.out.print("Enter the PIN(if aviailable) or just hit enter.[PIN]:");
            String pin = br.readLine();
            try {
                if (pin.length() > 0) {
                    accessToken = twitter.getOAuthAccessToken(requestToken, pin);
                } else {
                    accessToken = twitter.getOAuthAccessToken();
                }
            } catch (TwitterException te) {
                if (401 == te.getStatusCode()) {
                    System.out.println("Unable to get the access token.");
                } else {
                    te.printStackTrace();
                }
            }
        }

        //persist to the accessToken for future reference.
        storeAccessToken((int) twitter.verifyCredentials().getId(), accessToken);


        final ResponseList<Location> availableTrends = twitter.trends().getAvailableTrends();

        int i = 0;
        for (Location availableTrend : availableTrends) {
            System.out.println(availableTrend.toString());
            final Trends placeTrends = twitter.getPlaceTrends(availableTrend.getWoeid());

            for (Trend trend : placeTrends.getTrends()) {
                System.out.println(trend.toString());

                final QueryResult queryResult = twitter.search(new Query().query(trend.getName()).resultType(Query.ResultType.popular));

                for (Status status : queryResult.getTweets()) {
                    System.out.println(status.getText());

                    for (URLEntity urlEntity : status.getURLEntities()) {
                        System.out.println(urlEntity.getURL());
                        System.out.println(urlEntity.getExpandedURL());
                    }

                }
            }

            i++;

            if (i > 3) {
                break;
            }
        }


        System.exit(0);
    }

    private static void storeAccessToken(int useId, AccessToken accessToken) {
        //store accessToken.getToken()
        //store accessToken.getTokenSecret()
    }
}

/**
 *
 * /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/bin/java -Didea.launcher.port=7533 "-Didea.launcher.bin.path=/Applications/IntelliJ IDEA 13.app/bin" -Dfile.encoding=UTF-8 -classpath "/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/deploy.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/dt.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/javaws.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jce.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jconsole.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/management-agent.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/plugin.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/sa-jdi.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/charsets.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/classes.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/jsse.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/ui.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/apple_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/dnsns.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/localedata.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunjce_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunpkcs11.jar:/Users/ravindranathakila/ilikeplaces/NewsMute/finagle/target/classes:/Users/ravindranathakila/.m2/repository/Reaver/Reaver/1.0.4-SNAPSHOT/reaver-1.0.4-SNAPSHOT.jar:/Users/ravindranathakila/.m2/repository/com/google/inject/guice/2.0/guice-2.0.jar:/Users/ravindranathakila/.m2/repository/aopalliance/aopalliance/1.0/aopalliance-1.0.jar:/Users/ravindranathakila/.m2/repository/com/google/inject/extensions/guice-assisted-inject/2.0/guice-assisted-inject-2.0.jar:/Users/ravindranathakila/.m2/repository/net/sf/oval/oval/1.81/oval-1.81.jar:/Users/ravindranathakila/.m2/repository/Scribble/Scribble/1.0.1-SNAPSHOT/scribble-1.0.1-SNAPSHOT.jar:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-core_2.9.2/6.6.2/finagle-core_2.9.2-6.6.2.jar:/Users/ravindranathakila/.m2/repository/org/scala-lang/scala-library/2.9.2/scala-library-2.9.2.jar:/Users/ravindranathakila/.m2/repository/io/netty/netty/3.6.6.Final/netty-3.6.6.Final.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-app_2.9.2/6.5.0/util-app_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-core_2.9.2/6.5.0/util-core_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-collection_2.9.2/6.5.0/util-collection_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/google/guava/guava/15.0/guava-15.0.jar:/Users/ravindranathakila/.m2/repository/commons-collections/commons-collections/3.2.1/commons-collections-3.2.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-hashing_2.9.2/6.5.0/util-hashing_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-jvm_2.9.2/6.5.0/util-jvm_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-logging_2.9.2/6.5.0/util-logging_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-http_2.9.2/6.6.2/finagle-http_2.9.2-6.6.2.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-codec_2.9.2/6.5.0/util-codec_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/commons-codec/commons-codec/1.5/commons-codec-1.5.jar:/Users/ravindranathakila/.m2/repository/commons-lang/commons-lang/2.6/commons-lang-2.6.jar:/Users/ravindranathakila/.m2/repository/com/datastax/cassandra/cassandra-driver-core/2.0.0-beta2/cassandra-driver-core-2.0.0-beta2.jar:/Users/ravindranathakila/.m2/repository/org/codehaus/jackson/jackson-core-asl/1.9.13/jackson-core-asl-1.9.13.jar:/Users/ravindranathakila/.m2/repository/org/codehaus/jackson/jackson-mapper-asl/1.9.13/jackson-mapper-asl-1.9.13.jar:/Users/ravindranathakila/.m2/repository/com/codahale/metrics/metrics-core/3.0.1/metrics-core-3.0.1.jar:/Users/ravindranathakila/.m2/repository/org/slf4j/slf4j-api/1.7.5/slf4j-api-1.7.5.jar:/Users/ravindranathakila/.m2/repository/org/xerial/snappy/snappy-java/1.0.5/snappy-java-1.0.5.jar:/Users/ravindranathakila/.m2/repository/net/jpountz/lz4/lz4/1.2.0/lz4-1.2.0.jar:/Users/ravindranathakila/.m2/repository/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/Users/ravindranathakila/.m2/repository/org/jsoup/jsoup/1.7.2/jsoup-1.7.2.jar:/Users/ravindranathakila/.m2/repository/rome/rome/1.0/rome-1.0.jar:/Users/ravindranathakila/.m2/repository/jdom/jdom/1.0/jdom-1.0.jar:/Users/ravindranathakila/.m2/repository/org/mindrot/jbcrypt/0.3m/jbcrypt-0.3m.jar:/Users/ravindranathakila/.m2/repository/com/hazelcast/hazelcast/3.1.2/hazelcast-3.1.2.jar:/Users/ravindranathakila/.m2/repository/com/sun/jersey/jersey-client/1.18.1/jersey-client-1.18.1.jar:/Users/ravindranathakila/.m2/repository/com/sun/jersey/jersey-core/1.18.1/jersey-core-1.18.1.jar:/Users/ravindranathakila/.m2/repository/org/twitter4j/twitter4j-core/4.0.2/twitter4j-core-4.0.2.jar:/Applications/IntelliJ IDEA 13.app/lib/idea_rt.jar" com.intellij.rt.execution.application.AppMain ai.newsmute.service.Influencer
 Open the following URL and grant access to your account:
 https://api.twitter.com/oauth/authorize?oauth_token=lYV79bF6XdG26cKlIyCXkPyDOVfXohcW
 Enter the PIN(if aviailable) or just hit enter.[PIN]:4552467
 LocationJSONImpl{woeid=1, countryName='', countryCode='null', placeName='Supername', placeCode='19', name='Worldwide', url='http://where.yahooapis.com/v1/place/1'}
 TrendJSONImpl{name='#HappyVday', url='http://twitter.com/search?q=%23HappyVday', query='%23HappyVday'}
 #HappyVday Fans and BTS celebrate the birthday of member V on Twitter! http://t.co/BO1Myxxklk http://t.co/bLvlQTGEct
 Happy Birthday to #BTS' V! #HappyVDay http://t.co/D9N2s9Ggzi
 [FACEBOOK] 20th Happy 'V'irthday 2014 #HappyVday @BTS_twt http://t.co/OSj4t3uAab
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/cmgZ5IFYDH
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/r2y4fS2PqJ
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/MuIkN9SH7g
 {Pls RT} D-1 Going away from tradition (again)....let's trend #HappyVday as soon as clock ticks 12 midnight tonight! http://t.co/XhASWmimGv
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt http://t.co/u5e4NraspL
 It's time! V ! 생일축하해! Happy Birthday! We loVe you! #HappyVday @BTS_twt @bts_bighit @BigHitEnt - From #BTSARMY Crew http://t.co/oObtha7ZgV
 สุขสันต์วันเกิดนะวีวี่ #HappyVday เป็นบังทันที่อาร์มี่ภูมิใจตลอดไปนะ เราจะเป็นอาร์มี่ให้คุณภูมิใจตลอดไป ^^  @BTS_twt http://t.co/mg4rHSBXQd
 생일이니까!! 미공개 사진을 풀자!! - 4. 끝!! 언제나 다정한 태형이, 생일축하해>ㅁ< #HappyVday @BTS_twt http://t.co/gG028BTvEB http://t.co/7ydxNdWmyp http://t.co/eJbPRj3vFS
 TrendJSONImpl{name='#Replace5SOSLyricsWithToast', url='http://twitter.com/search?q=%23Replace5SOSLyricsWithToast', query='%23Replace5SOSLyricsWithToast'}
 When you change your mind I'll be waiting
 'Cause I'm better than toast.
 #Replace5SOSLyricsWithToast #5secondsoftoast http://t.co/ZP7XaSfLqg
 u look so perfect standing there in my cinnamon toast crunch underwear

 #5SecondsOfToast #Replace5SOSLyricsWithToast http://t.co/XyvynDB48Q
 i play guitar but shes into toasters #Replace5SOSLyricsWithToast http://t.co/bSPKct92Ir
 I dedicate this TOAST to you 🍞 -alex
 #Replace5SOSLyricsWithToast http://t.co/TS3SAVTmdP
 she looks so perfect standing there... and i'm eating my toast in my underwear  #Replace5sosLyricsWithToast http://t.co/4rOgalNZye
 You walked in, everyone was asking for your name, you just smiled and told them "toast"

 #Replace5soslyricswithtoast
 So we're taking the long way home 'cause I don't wanna be wasting my toast alone

 #Replace5soslyricswithtoast
 #5SecondsOfToastFollowParty
 Heartbreak Toast
 Beside Toast
 What I Like About Toast
 Heartache on the big toast
 #Replace5SOSLyricsWithToast
 This is too much its really stupid I'm so weird but I can't help it.
 #Replace5SOSLyricsWithToast http://t.co/ZKCkh805vI
 When you change your mind i'll be toasting just saying #Replace5SOSLyricsWithToast
 Cause good toasts are bad toasts that haven't been caught #Replace5SOSLyricsWithToast
 good girls are bad girls that haven't been toast

 #Replace5sosLyricsWithToast
 you call me up it´s like a toasted record #Replace5SOSLyricsWithToast
 im a piece of toast but shes into waffles
 #Replace5SOSLyricsWithToast http://t.co/gK1nnD1XhQ
 i cant forget my french toast love affair #Replace5sosLyricsWithToast http://t.co/v4vnEiHhXe
 TrendJSONImpl{name='#NoelBabadanİsteğim', url='http://twitter.com/search?q=%23NoelBabadan%C4%B0ste%C4%9Fim', query='%23NoelBabadan%C4%B0ste%C4%9Fim'}
 TrendJSONImpl{name='#LinesPagNagseselos', url='http://twitter.com/search?q=%23LinesPagNagseselos', query='%23LinesPagNagseselos'}
 Baka naman nakakaistorbo ako. #LinesPagNagseselos
 Matutulog na ako. Night #LinesPagNagseselos
 Mga kadalasang linya pag nagseselos:

 -Oh talaga?
 -Tss
 -Magsama kayo
 -Ah ganun?
 -Ah...ok

 at higit sa lahat:
 -K

 #LinesPagNagseselos
 #LinesPagNagseselos http://t.co/o4lUnmL6M3
 #LinesPagNagseselos http://t.co/f2i2W8zBIN
 #LinesPagNagseselos http://t.co/mcsPM6Pqi9
 #LinesPagNagseselos http://t.co/yR1o0uBeF9
 #LinesPagNagseselos http://t.co/LnMJG8JsAr
 #LinesPagNagseselos http://t.co/I2WdqDuZtj
 Tagal magreply a. Ge text ka na lang pag free ka na #LinesPagNagseselos
 Text ka na lang kapag may time ka na sakin. #LinesPagNagseselos
 Ahahhahahahha. Masaya ako para sa inyo #LinesPagNagseselos
 Don ka na. Nageenjoy ka naman e. #LinesPagNagseselos
 Okay lang ako dito. OKAY LANG AKO. #LinesPagNagseselos
 E diba masaya ka naman don? #LinesPagNagseselos
 TrendJSONImpl{name='#WeDemandFifthHarmony', url='http://twitter.com/search?q=%23WeDemandFifthHarmony', query='%23WeDemandFifthHarmony'}
 Sobre o #WeDemandFifthHarmony ele conta apenas um "voto" por conta, não adianta ficar tweetando x100 pois não alterará em nada
 Los fans de @FifthHarmony están hablando! TT en España: #WeDemandFifthHarmony
 Quem ai gostaria de ver as meninas em São Paulo denovo? Tweetem
 #WeDemandFifthHarmony São Paulo
 Fifth Harmony em 2015 podia fazer que nem o RBD em 2006, fazer shows no Brasil todo #WeDemandFifthHarmony assim todo mundo saia ganhando
 #WeDemandFifthHarmony São Paulo
 Es mejor que vengan a Madrid y les guste y vuelvan más tarde a otras ciudades, que directamente no vengan #WeDemandFifthHarmony Madrid
 São Paulo #WeDemandFifthHarmony
 Retweet to let @FifthHarmony know you want a show in your city! #WeDemandFifthHarmony @WeDemand See top cities: http://t.co/Ej6TewpSB9
 #WeDemandFifthHarmony Rio de Janeiro
 Quem ai é de Recife ou região e gostaria de ver as meninas por ai? Tweeta
 #WeDemandFifthHarmony Recife
 #WeDemandFifthHarmony http://t.co/XJilATHGl5
 if the girls have already come and go to your city like more than twice a year can you not tweet this tbfh #WeDemandFifthHarmony
 O TOP 10 do #WeDemandFifthHarmony e pode ser encontrado no site http://t.co/Qe8o7AMDyU http://t.co/J8Iy1MMfsf
 Recordar que es muy difícil que vayan a otra ciudad que no sea la capital,ya que será la primera vez que vengan #WeDemandFifthHarmony Madrid
 TrendJSONImpl{name='ÜlkeYanıyor HükümetSaçTarıyor', url='http://twitter.com/search?q=%22%C3%9ClkeYan%C4%B1yor+H%C3%BCk%C3%BCmetSa%C3%A7Tar%C4%B1yor%22', query='%22%C3%9ClkeYan%C4%B1yor+H%C3%BCk%C3%BCmetSa%C3%A7Tar%C4%B1yor%22'}
 Cizre bu ülkenin toprağı değil mi? Hükümetin niye sesi çıkmıyor?!
 ÜlkeYanıyor HükümetSaçTarıyor
 İhanetle, provokasyonu karıştıranlar ülke yönetemez.! [ ÜlkeYanıyor HükümetSaçTarıyor ]
 pkk yol kesip kimlik kontrol ediyor.
 Bayrağımız İndiriliyor. Devlet nerde?
 ÜlkeYanıyor HükümetSaçTarıyor
 domuz sürüsü yol kesip kimlik kontrol ediyor,
 kaymakam atayıp para basıyor
 ÜlkeYanıyor HükümetSaçTarıyor
 aKP, memleket yanarken görmezden gelip, memleketi yakanları temize çıkarmaya çalışmaktadır. [ ÜlkeYanıyor HükümetSaçTarıyor ]
 ÜlkeYanıyor HükümetSaçTarıyor
 TrendJSONImpl{name='DoğudaTerör BatıdaHırsızVar', url='http://twitter.com/search?q=%22Do%C4%9FudaTer%C3%B6r+Bat%C4%B1daH%C4%B1rs%C4%B1zVar%22', query='%22Do%C4%9FudaTer%C3%B6r+Bat%C4%B1daH%C4%B1rs%C4%B1zVar%22'}
 TERÖRİSTLER VE HIRSIZLARDAN HESAP SORMAYA HEPAR GELİYOR!

 TT GÜNDEM ÇALIŞMAMIZ >> DoğudaTerör BatıdaHırsızVar << http://t.co/mBNgiMD5D3
 ETİKETİMİZ TÜRKİYE GÜNDEMİNE GİRMİŞTİR. EMEĞİ GEÇEN HERKESE TEŞEKKÜRLER.

 DoğudaTerör BatıdaHırsızVar http://t.co/tbTFiHAZpF
 "SİZ ÜLKENİZİN ŞEREFİNİ KORUYUN,O SİZİN GELECEĞİNİZİ KORUR !"
 Osman PAMUKOĞLU

 == DoğudaTerör BatıdaHırsızVar ==
 TrendJSONImpl{name='KaliteliTT Whats507x185x5302', url='http://twitter.com/search?q=%22KaliteliTT+Whats507x185x5302%22', query='%22KaliteliTT+Whats507x185x5302%22'}
 "KaliteliTT Whats507x185x5302" 18:26'da TT'de 10. sırada! Analiz > http://t.co/n9v1VzEZjt
 TrendJSONImpl{name='رنا سماحة', url='http://twitter.com/search?q=%22%D8%B1%D9%86%D8%A7+%D8%B3%D9%85%D8%A7%D8%AD%D8%A9%22', query='%22%D8%B1%D9%86%D8%A7+%D8%B3%D9%85%D8%A7%D8%AD%D8%A9%22'}
 أهل الفن l تلفزيون دبي
 رنا سماحة تستعد لتقديم أغنيتها الخليجية الأولى @ranasamaha9t
 http://t.co/sJrD23WlIo http://t.co/lhE6qSYHsf
 الي النووووم العميق 😘😘😘 #me #RanaSamahaTeam #رنا_سماحة #رنا_استايل #star #style #singer #like #love… http://t.co/ZHBM4n0M0q
 قريباً: جديد الفنانة رنا سماحة عمل خليجي يجمعها مع الشاعر آل الشيخ - صحيفة بث الإلكترونية http://t.co/Vi51yIZcRf
 #RanaSamahaTeam
 بالصور – مينا عطا يصل إلى القاهرة وسط أستقبال جماهيرى كبير وبحضور رنا سماحة ومحمد سراج

 http://t.co/dXu5UAWISD

 #MinaAtta
 #RanaSamahaTeam
 #فور_فن |  #رنا_سماحة و #يوسف_عرفات ضيوف “عمرو الليثي” في بوضوح غداً http://t.co/UEd4VCYz7B
 #رنا_سماحة و #يوسف_عرفات ضيوف "عمرو الليثي" في #بوضوح غداً
 @ranasamaha9t @_YousefArafat
 http://t.co/8Imt9lMFcm http://t.co/12LbPZRTEr
 الليلة في #بوضوح النجمة #رنا_سماحة والنجم #يوسف_عرفات مع الإعلامي عمرو الليثي على شاشة #الحياة http://t.co/kxAZkWs2Oe
 جميل ان ترى حب وشغف كبيرين وهذا ماوجدته في فانزات #رنا_سماحة التي كانت ضيفتي في مجلة اليقظة  @ranasamaha9t @alyaqzaa http://t.co/ymo7o1YAsQ
 رنا سماحة و يوسف عرفات ضيوف “عمرو الليثي” في بوضوح غداً http://t.co/nYN6UqeNAW
 #رنا_سماحة و #يوسف_عرفات ضيوف “عمرو الليثي” في بوضوح غداً http://t.co/4h8w2AenEL http://t.co/nu4weI8ztV
 حوار مع النجمة #رنا_سماحة في مجلة #اليقظة _الكويتية 💙😍 مع الصحفي #حسين_الصيدلي🎵💙

 @ranasamaha9t

 #RanaSamahaTeam http://t.co/ECkyXjyKEk
 ماشاء الله محبه رنا سماحة ثابته في قلوب الناس
 في اي مكان ليها احترام وتقدير
 نيتها وطيبتها سندها
 وحب الناس اقل مكافاه ليها😻
 #RanaSamahaTeam
 النجمة رنا سماحة تعلن عن تحدي جديد فهل أنتم "قدها"؟؟

 نشرت النجمة رنا سماحة عبر صفحتها مفاجأة جديدة لجمهورها... http://t.co/WNqnTjY5dd
 رنا #سماحة فى أول أغنية #خليجية لها http://t.co/4wfac47y2C
 #رنا_سماحة و #محمد_سراج يستقبلان شاهين فى المطار: http://t.co/i1yGuCm32h http://t.co/tA8IZdMIfU
 TrendJSONImpl{name='Virgin Atlantic', url='http://twitter.com/search?q=%22Virgin+Atlantic%22', query='%22Virgin+Atlantic%22'}
 Virgin Atlantic flight #VS43 is heading for Gatwick again. Emergency vehicles are waiting at the airport. http://t.co/ApwcBf2xcR
 Virgin Atlantic flight #VS43 currently circling above UK preparing for "non-standard landing" http://t.co/jcwOVHG6S8 http://t.co/Mkwgd94A8U
 Wishing Virgin Atlantic flight #VS43 lands safely and nobody is injured
 I'm relieved to say that Virgin Atlantic flight #VS43 landed safely!
 Virgin Atlantic flight #VS43 "preparing to implement non-standard landing" at Gatwick Airport http://t.co/eKM6khHuAZ http://t.co/cZciMHBnoQ
 Virgin Atlantic flight #VS43 has landed safely at Gatwick Airport http://t.co/jcwOVHG6S8 http://t.co/SQEv1JFbd4
 Virgin Atlantic plane to make emergency landing at Gatwick Airport with landing-gear problem: http://t.co/CSXCNjo1AQ
 Virgin Atlantic plane currently circling over Gatwick due to technical fault. More to follow. http://t.co/eKM6khHuAZ http://t.co/s9142h3Uxa
 Virgin Atlantic plane to make emergency landing at Gatwick http://t.co/gaFIZQ1Kws  #VS43 http://t.co/iLr3glR3oQ
 Update - Virgin Atlantic says flight #VS43 will implement a "non-standard landing procedure" at Gatwick Airport
 Pictures of the day: Virgin Atlantic flight VS43 lands safely despite gear malfunction (Rex) http://t.co/Vf4hu7RMgh http://t.co/Er1QuA27AM
 BREAKING Virgin Atlantic #VS43 Right wing landing gear not down!!! Boeing 747 circling Track: http://t.co/mzKkQjAQr1 http://t.co/F8IkKjlTNe
 BREAKING Virgin Atlantic #VS43 Boeing 747 circling at 5,000ft with serious gear issue Track: http://t.co/mzKkQjAQr1 http://t.co/JnlN61VwVe
 Virgin Atlantic Flight VS43 lands safely at Gatwick Airport after problems with landing gear - @BBCBreaking http://t.co/ERZktKeK7p
 CONFIRMED: Virgin Atlantic flight with landing gear problem makes successful "non-standard" landing in London WATCH: http://t.co/wSKNe2nSgZ
 LocationJSONImpl{woeid=2972, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Winnipeg', url='http://where.yahooapis.com/v1/place/2972'}
 TrendJSONImpl{name='Winnipeg', url='http://twitter.com/search?q=Winnipeg', query='Winnipeg'}
 O'Reilly being offered around the league for a good D-man. Florida and Winnipeg. Pondering, Toronto and Montreal too
 I have arrived in Winnipeg and packed correctly for #mnwild #nhljets game http://t.co/MCXSFGhmyZ
 #mnwild on ice before heading to Winnipeg. No Backstrom, Zucker, Granlund or Brodin http://t.co/r0PAkdeRx3
 Extreme cold warnings issued for Winnipeg and much of southern Manitoba, as wind-chills touch -40 tonight. http://t.co/vLBwIZVghe
 #mnwild and #NHLJets tonight at 7 in Winnipeg! Where are you watching/listening from? #MINvsWPG http://t.co/vqJagGn7RG
 #mnwild plane getting ready to depart MSP for Winnipeg. Game Monday! http://t.co/nwGdLuYT0i
 Protesters hold round dance at Winnipeg's Portage Place mall http://t.co/jjbUZV0enL http://t.co/RnrOxsjAcB
 Environment Canada says it will issue Extreme Cold Warnings for #Winnipeg and southern Manitoba this afternoon as windchills touch -40.
 Josh Morrissey made sure fellow Winnipeg Jets prospect Eric Comrie got the game puck after his 1st career WJHC game/shutout
 #mnwild coach Mike Yeo: Backstrom, Granlund, Brodin and Zucker not going to Winnipeg. Severity of Granlund/Brodin injuries still uncertain.
 STAR-7 (Winnipeg) has been dispatched for an inter-hospital transport in the Crystal City, MB area.
 EXTREME COLD WARNING: in effect for all of #Manitoba wind chills expected to reach -40 to -45 overnight. Bundle up! #cbcmb #Winnipeg #Bdnmb
 AccuWeather RealFeel® temp in Winnipeg, Manitoba, is -37 C (-35 F); air temp is -28 C (-18 F):  http://t.co/IObGS1RBOE
 No top 5 this past weekend, so instead, a top 10 NYE parties in Winnipeg column: http://t.co/bLNNvl5cd7 #cbcmb http://t.co/MNNkQ5kslQ
 TrendJSONImpl{name='New Years', url='http://twitter.com/search?q=%22New+Years%22', query='%22New+Years%22'}
 This is me on New Years. http://t.co/VrbGCq36V1
 So do you all have your New Years resolutions ready??
 RT if you want us to make a "Like That" music video right after New Years!
 Who's kissing me on New Years
 Alcohol or my tears
 Me on new years  http://t.co/w0uZOkPYnT
 New Years resolution 👌 http://t.co/S7ZT5u9Pdz
 New Years resolution: http://t.co/PxQVgnaawB
 #NashsChristmasSkit Hope you liked the video! I can't wait to show you my New Years Skit! Subscribe to my channel!!! http://t.co/2EpVlv09iY
 New Years resolution: http://t.co/KcakWvl1MZ
 This is me on New Years. http://t.co/Hmia6N9Sd1
 Kinda want a New Years kiss kinda want 10 shots of tequila instead
 i've never had a new years kiss, or a mistletoe kiss but i did have a hershey's kiss and it was spectacular
 New Years resolution: http://t.co/TqtkPWzSnJ
 New Years resolution 🙏🙌 http://t.co/uXK5jqllpC
 New Years Resloution: http://t.co/HTOFWHRU6S
 TrendJSONImpl{name='Wild', url='http://twitter.com/search?q=Wild', query='Wild'}
 Every child born from now on is at risk of never seeing an elephant or a rhino in the wild http://t.co/uYBYRDywgB http://t.co/JPfmjawJ0h
 new years resolution....
 1080 dpi
  *drumkit explodes crowd goes wild baby jesus dunks microphone into glass of blood orange s. pellegrino*
 NFC Wild Card Round games:
 • Detroit at Dallas
 • Arizona at Carolina
 WILD CARD SUNDAY LATE AFTERNOON

 @Lions vs. @dallascowboys

 4:40 PM ET on FOX
 #방탄소년단 ‘DARK&WILD’ 공개방송 출석 이벤트 당첨자 안내
 http://t.co/uJ5jej8aIT
 Heyecan ve tehlike kol kola geziyor. Birbirlerinin facebook şifresini bilen sevgililer, Nat Geo Wild'da.
 NFC Playoff Schedule Wild Card weekend is set:
 • Cardinals at Panthers (Saturday, 4:35 ET on ESPN)
 • Lions at Cowboys (Sunday, 4:40 ET)
 The Ravens just flew their way into the playoffs. That's pretty wild right there. They're also the Wild Card. That's even more wild, man
 AFC Wild Card Weekend schedule:
 • Ravens at Steelers (Saturday, 8:15 ET)
 • Bengals at Colts (Sunday, 1:05 ET)
 WILD CARD SUNDAY

 1:05 PM ET on CBS

 If CIN wins tonight:

 @Ravens vs. @Bengals

 If PIT wins tonight:

 @Bengals vs. @Colts
 Trying to understand AFC Wild Card scenarios... http://t.co/rKgJ3HDuiw
 So on wild-card weekend, it's Detroit at Dallas, and Arizona at Carolina.
 The Ravens will travel to Pittsburgh for a wild-card game next Saturday night.

 READ: http://t.co/REGTO1bp7J http://t.co/hSamd8lniL
 Wild Card Weekend:

 Sat:
 • ARI at CAR - 4:35p ET, ESPN
 • BAL at PIT - 8:15p ET

 Sun:
 • CIN at IND - 1:05p ET
 • DET at DAL - 4:40p ET
 larry in 2014...well November was pretty wild http://t.co/Sn4ib6GIAe
 TrendJSONImpl{name='Don Cherry', url='http://twitter.com/search?q=%22Don+Cherry%22', query='%22Don+Cherry%22'}
 Don Cherry: #Oilers' Nail Yakupov "a little coward" for hit he delivered earlier this week. http://t.co/e2x8SSB3Vv http://t.co/RHq3L8U3Us
 Don Cherry isn't messing around tonight. http://t.co/agBNTjOHPu
 Suit up. Don Cherry is coming to Netflix. http://t.co/0gtxHypTZD
 TrendJSONImpl{name='Christmas', url='http://twitter.com/search?q=Christmas', query='Christmas'}
 multiply is now 6x platinum in the uk, which has matched my first album, which i didn't think i could do. god bless christmas
 Check out this weeks new Christmas themed skit- http://t.co/2EpVlv09iY ! & make sure to subscribe to my channel for weekly videos!
 Glad you guys are enjoying the christmas album! Was fun to make
 https://t.co/i9f15sSevr
 i like it when words sound like their meaning. like how the word "Christmas" sounds all sparkly like Christmas. and "worm" sounds all slimy
 "what did you get for christmas?"

 fat
 Person: what did u get for christmas

 Me: fat
 เวลาฝรั่งพูดว่า you look like a christmas  tree เนี้ยเค้าไม่ใด้ชมว่าแต่งตัวได้สวยงามเหมือนต้นคริสมัสนะ เค้าจิกว่าแต่งตัวมากเกินไป
 Outdoor Christmas Decorations  Giant 6'9' Popcorn by JabberDuck http://t.co/74epiKmgqN http://t.co/LP4iOAX0dj
 Outdoor/ CHRISTMAS DECORATIONS CANDY Decorations Hand by JabberDuck http://t.co/r8mv6Oo1Tu http://t.co/TmvHEBrMPz
 CHRISTMAS DECORATIONS Outdoor CANDY Decorations Hand by JabberDuck http://t.co/obiJEEv6in http://t.co/w7zAllzIxQ
 Niall Horan visits Children's Hospital in Dublin whilst at home over Christmas break http://t.co/a0LqCmBCkY http://t.co/b4xxZNEidl
 my armpits smell like diner pickles. its time to wash this Christmas off
 there are 363 days till Christmas and people already have their Christmas lights up

 unbelievable
 TrendJSONImpl{name='Polo', url='http://twitter.com/search?q=Polo', query='Polo'}
 김현준 : เมนูอาหารของ Viva Polo ที่แนะนำคือ!??!!? วันนี้ว่าจะไปแหละ!!!
 ชาน: Kimchi Arrabiata ครับ!
 Así que fuimos hasta mi casa «que es el polo», le advertí, «con un colchón nos basta, de estufa, corazón, te tengo a ti»
 Viajar a Disney con @sofmorin toda una experiencia jaja ✌️ http://t.co/ae1GUG89Yo
 From Djokovic and Water-Polo domination to the Basketball World Cup finals, Serbia land of sport 2014! http://t.co/N7DTuGNX09
 104. Did U know settlers R recorded as placing Aboriginal babies into sand with head out &using polo mallets 2 cause death
 #blackfullafacts
 [TRANS] 141228 CHANYEOL EXO-L Chat

 Chanyeol: Kimchi Arabiatta!!

  *isn't that his fave dish from Viva Polo >< http://t.co/o67PJha3MZ
 salir a la calle y correr el riesgo de salir volando hasta el polo norte.
 Me pierdo de polo a polo en encontrar alguien con quien poder reír poder llorar. #FrasesDeLPDA
 @piersmorgan shouldn't you support a polo team or a yachting club. But working class for your sort this football lark, eh?
 -Viajaré al Polo Norte a admirar los hielos esos gigantes...
 -¿Iceberg?
 -Pues claro que se ven, si son gigantes te he dicho
 -Mejor no vayas
 Sebastien Ogier and Julien Ingrassia played it cool, driving their Polo R WRC to victory at Rally Sweden 2013. http://t.co/nszDUTUeyr
 NOVE QUE RASCA HACE COMPARE, HA VENÍO PAPÁ NOÉ Y SA TRAÍO AQUÍ TOR FRÍO DER POLO NORTE ER MAMÓN.
 Tras debacle en alcaldía del Polo, candidata del Polo encabeza encuestas para alcaldía de Bogotá. #alobien #especial28
 La soltería se disfruta, una relación se respeta. Así de simple.
 Senador Robledo, el Centro Democrático apoya solo algunos temas legislativos del gobierno que ayudó a elegir su partido, el Polo Democrático
 TrendJSONImpl{name='Petan', url='http://twitter.com/search?q=Petan', query='Petan'}
 Canada lines v Germany:

 Domi-Reinhart-Duclair
 Ritchie-McDavid-Lazar
 Paul-Petan-Fabbri
 Crouse-Gauthier/Point-Virtanen
 VIDEO: Nic Petan demonstrates quick feet attack moves: http://t.co/2ZPLDVEQL0 @SportChek Hockey Skills. #HereWeGo http://t.co/tb8Ax1vyRL
 Gauthier (84.2%) is No. 1 in #WJC2015 faceoff pct. Reinhart is 5th (69.7), Petan & McDavid: 50.0. Canada is at 63.8%. http://t.co/wTKJlpECWo
 Petan shelfs it in this goal! 😱
 https://t.co/VSWXSfhp9s
 Petan with a beauty goal #2015WJC
 https://t.co/M01adrN9tk
 Team Canada opened the World Junior Hockey Championship with an 8-0 win last night http://t.co/w0bg8idLZy http://t.co/1p4eswXHAy
 Fabbri, Petan shine, Canada opens world juniors with 8-0 win
 http://t.co/QDDgIFbQMz http://t.co/ss1HUyCw66
 Fabbri, Petan shine as Canada opens world juniors with 8-0 win over Slovakia http://t.co/dJrq4cnXWT http://t.co/xku8FF4As6
 Petan with a beauty to put Canada up 7-0 against Slovakia. #WorldJuniors #GoCanadaGo
 https://t.co/LMMshAAMEh
 Another one for #TeamCanada scored by Nic Petan. #Canada now up 7-0 on Slovakia at #WJC2015 http://t.co/jgBhcB4C62
 Team Canada lines v Slovakia:

 Domi-Reinhart-Duclair
 Ritchie-McDavid-Lazar
 Paul-Petan-Fabbri
 Crouse-Gauthier-Virtanen
 Point (RW)
 All 30 teams have at least 1 player @ WJC. Winnipeg leads with 6: Comrie, Morrissey, Petan (CAN), Ehlers (DEN), De Leo (USA), Kostalek (CZE)
 #petan
 Canada opens world juniors with 8-0 win over Slovakia http://t.co/qXk5tsgsvP http://t.co/xc6MZzzFLZ
 Canada wins 8-0

 Fabbri 2-2
 Petan 1-2
 Duclair 1-1
 Domi 1-1
 Point 1-1
 Virtanen 1-1
 Reinhart 0-2
 Paul 1-0
 Bowey 0-1
 Hicketts 0-1
 Crouse 0-1
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='Matt Cooke', url='http://twitter.com/search?q=%22Matt+Cooke%22', query='%22Matt+Cooke%22'}
 TrendJSONImpl{name='Slovakia', url='http://twitter.com/search?q=Slovakia', query='Slovakia'}
 20 hours after losing 8-0 to Canada, Slovakia upsets last year's gold medalist Finland 2-1 at the #2015WJC
 Slovakia's Erik Cernak suspended one game, tomorrow vs. USA, after check to the head and neck area of Rantanen. http://t.co/YZ1Uq8tvO4
 Bye Slovakia... http://t.co/gYUHaAQwtN
 Martin Reway and Team Slovakia pulled off a major upset in Montreal this afternoon. READ -> http://t.co/7MDLdZ9M6l http://t.co/zhQwpzicXV
 #WorldJuniors today on @NHLNetwork:
 Fasching, Compher, USA vs. Slovakia, 4pm
 Reinhart, Canada vs. Finland, 8pm

 On MSG, #Sabres #Sens 7:30pm
 The @USAhockey team will be back in action in World Juniors today against Slovakia at 4 pm ET on @NHLNetwork
 Sivý Vrch, Slovakia http://t.co/VZa16hVYzV
 SVK 2, FIN 1: Denis Godla stops 37 for Slovakia in upset of 2014 champions Finland. http://t.co/5v8zlKyKm6 http://t.co/qqA8WNtxci
 Martin Reway picks up a couple of assists to lead Slovakia over Finland by a score of 2-1 in Montreal this afternoon. #WJC2015
 Robby Fabbri had two goals and two assists for Canada last night in his first game of the #WJC2015 vs. Slovakia. http://t.co/Viwq49P9rN
 great team perfromance and spectacual goaltending, so proud of this team ! #slovakia #big #win http://t.co/epSDQMeOiS
 Final: Slovakia 2, Finland 1. The defending champions have yet to win a game at #WJC2015. http://t.co/UnVR2NL7Tp
 Anybody else taking great pleasure in the fact that Slovakia is ahead of the USA in the #WorldJuniors standings?
 ON NOW: Slovakia leads Finland 2-1 heading into the 3rd period on #TSN. #HereWeGo http://t.co/YUoiJMEHsL
 #WJC2015 | #SVK 2 #FIN 1 @CanadiensMTL prospect @rewy77 with 2 assists to lead #Slovakia to the victory. http://t.co/WRpAiS7lQE
 LocationJSONImpl{woeid=3369, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Ottawa', url='http://where.yahooapis.com/v1/place/3369'}
 TrendJSONImpl{name='New Years', url='http://twitter.com/search?q=%22New+Years%22', query='%22New+Years%22'}
 This is me on New Years. http://t.co/VrbGCq36V1
 So do you all have your New Years resolutions ready??
 RT if you want us to make a "Like That" music video right after New Years!
 Who's kissing me on New Years
 Alcohol or my tears
 Me on new years  http://t.co/w0uZOkPYnT
 New Years resolution 👌 http://t.co/S7ZT5u9Pdz
 New Years resolution: http://t.co/PxQVgnaawB
 #NashsChristmasSkit Hope you liked the video! I can't wait to show you my New Years Skit! Subscribe to my channel!!! http://t.co/2EpVlv09iY
 New Years resolution: http://t.co/KcakWvl1MZ
 This is me on New Years. http://t.co/Hmia6N9Sd1
 Kinda want a New Years kiss kinda want 10 shots of tequila instead
 i've never had a new years kiss, or a mistletoe kiss but i did have a hershey's kiss and it was spectacular
 New Years resolution: http://t.co/TqtkPWzSnJ
 New Years resolution 🙏🙌 http://t.co/uXK5jqllpC
 New Years Resloution: http://t.co/HTOFWHRU6S
 TrendJSONImpl{name='Ottawa', url='http://twitter.com/search?q=Ottawa', query='Ottawa'}
 "If you don't find your roommate weird, you're probably the weird roommate" -  U Ottawa
 Según la universidad de Ottawa, la mujer ha evolucionado para ser mala con otras mujeres.
 Our guys timed Nyqvist as having the puck for 28 seconds before he scored the winning goal vs Ottawa. Hell of a shift.
 Nyquist's overtime heroics lift Detroit in Ottawa!

 DRWBlog: http://t.co/woVwRrF2dS http://t.co/Ij3ibatlEi
 Just arrived in Ottawa! Food coma. Now sleep for 10 hours. Tomorrow I play EY centre with @DVBBS & @OliverHeldens :)
 The risks of remembering the Ottawa shooting http://t.co/fB7LLNDXMU Part of Bearing Witness, 2014's news told by people who were there
 In Ottawa for one day! Working on #LesCoeursQuiCraquent in the car :)
 Iconic royal guards pulled from outside Buckingham Palace over fears of Ottawa-style attacks http://t.co/VjQOG2tLTB http://t.co/npuJ06AHah
 FIRST LOOK: Stephen Weiss takes the ice for warm ups in Ottawa. #ATTExtCoverage http://t.co/gnHH9uwlAM
 Six bystanders ran to help Cpl. Nathan Cirillo. They were strangers then. They are not now. http://t.co/5MeJ8Xmei9 http://t.co/8uWKHZbXyU
 My brother is with me on tour, we're on our way to Ottawa! Will be an epic night with the bro's @DVBBS and @tyDi :) http://t.co/XSlrHvIc23
 The #RedWings have hit the ice for warm-ups here in Ottawa. #GoWings https://t.co/ysh2rYqQnh
 Amazing. Red Wings Nyquist controlled the puck in Ottawa end a full 30 seconds on his own before scoring in OT.
 TrendJSONImpl{name='#CamAndNash', url='http://twitter.com/search?q=%23CamAndNash', query='%23CamAndNash'}
 Tweet me pictures of me and Nash #CamAndNash (:
 Here's a #CamAndNash photo I never posted from this summer http://t.co/L0tbHa0AEr
 THIS WAS A YEAR AGO TODAY WHAT #CamAndNash http://t.co/YApNX8i9Yr
 Friendship Goals #CamAndNash http://t.co/iKvb11UWfD
 Because you stayed together even in the most difficult moments. That's why you're my favorite duo❤ #CamAndNash http://t.co/hGmGZZCju5
 A LOT OF THINGS HAVE CHANGED IN THE PAST YEAR BUT ONE THING THAT DIDNT CHANGE & NEVER WILL IS #CamAndNash FRIENDSHIP http://t.co/yotlFaXQZh
 #CamAndNash BASICALLY BROTHERS http://t.co/ZuYpzg776J
 It's crazy what one year can do
 #CamAndNash http://t.co/cel9NxYuGG
 Friend goals #CamAndNash http://t.co/TyyJEzaHtm
 "I would have never wanted to experience this with anyone else"this is why you're my favorite friendship😢 #CamAndNash http://t.co/L0IBkiI4D7
 FORÇAS EU PRECISO DE FORÇAS #CamAndNash http://t.co/Hb0KhHeZ7X
 NASH AND CAM ARE BROTHERS FROM DIFFERENT MOTHERS. THEIR FRIENDSHIP SLAYS EVERYTHING #CamAndNash  https://t.co/RFqwROR5Ja
 They're both dorks but that's what makes them bestfriends #CamAndNash http://t.co/hI2i1DLSKn
 RT IF YOU ALWAYS ARE HERE FOR SUPPORT THEM ASF #CamAndNash Cash ♥☺ http://t.co/bje9rSqwNG
 #HappyBirthdayNash #CamAndNash @camerondallas @NashgrierI literally love Cam and Nash’s friendship. http://t.co/ctsTedIhtp
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='The Wire', url='http://twitter.com/search?q=%22The+Wire%22', query='%22The+Wire%22'}
 Wire Trivia: NYPD called to complain drug crews in NY were mimicking The Wire and started using "burners" #TheWireMarathon
 The Wire is pure, unadulterated American cultural genius. Seeing the marathon in HD after all these years only reaffirms it. Best Drama Ever
 In about 90 minutes, there will be simultaneous TV marathons of The Wire and Breaking Bad. What a great and glorious time we live in.
 Between talking about Boogie Nights and The Wire you can go on a successful first date with any guy in LA
 This is what The Wire looks like in HD http://t.co/57Uv3nSemI http://t.co/Dcd1hd1UX8
 Season 4 of The Wire is the best season of television in the history of television. I really mean that.
 Also, I judge people based on whether or not they liked Season 2 of The Wire.
 HBO Signature should just rotate The Wire marathons and The Sopranos marathons. That should be the entire channel. Sheeeeeeeeeeee-et.
 The Rockets have won the last 6 consecutive vs San Antonio, including a 5-0 series sweep last season & a wire-to-wire victory on 11/6 in HOU
 See before and after photos of locations from 'The Wire' http://t.co/QDEfDzEHvv http://t.co/bl1Vq7Aen2
 Wire trivia: I never knew Butch was REALLY blind until the day we shot the scene where I picked up the gun #TheWireMarathon
 Why are professors at Harvard, Duke, and Middlebury teaching courses on The Wire? http://t.co/aYO5uhAs3Z http://t.co/9MjUWN71MF
 It's coming down to the wire in South Beach! @MiamiHEAT trail @MemGrizz by 4 with 1:30 remaining on NBA TV.
 TrendJSONImpl{name='Toronto', url='http://twitter.com/search?q=Toronto', query='Toronto'}
 Lou Williams is a serious candidate for 6th man of the year. He's been great for Toronto. Lou has 21 points in 22 minutes tonight.
 Travelers will soon walk under a lake to catch flights in Toronto http://t.co/QuOiYSt4Wk
 TICKET UPDATE: Only 30 Silver Meet&Greet VIP's left in TORONTO for #DigiFestToronto --> http://t.co/njltpL5HAR RT!! http://t.co/BdIqyf5ph2
 Kyle Lowry is LEADER OF MEN. 30 pts, 11 ast & 7 rebs vs Denver. Best player in Toronto, period. #NBABallot http://t.co/9ObvCD3R0t
 Toronto you make me feel like home 🙌
 #Toronto, Canada. http://t.co/b5SuaryJ4F
 Toronto, Trinidad, LSD trips, haunting paintings. Excellent. http://t.co/f8If1isI2x #PeterDoig http://t.co/9Ji7EfDObS
 Porter Airlines Flight PD539 makes emergency landing in Toronto http://t.co/cNJzPTxi0v http://t.co/iIFDYNtaZN
 URGENTE | Vuelo #PD539 aterrizó en Toronto. Motor derecho explotó, hay un pasajero herido.
 I'm so impressed by Toronto. They're 23-7, and 10-4 since DeMar DeRozan got hurt. How many teams could do that without their leading scorer?
 Plane from Toronto to DC makes emergency landing in Pennsylvania; smoke detected in cabin: http://t.co/zh2YYo4Unh
 Clips have to play Hedo and Big Baby in the last 8 mins of this Toronto game. I might have to invite GM Doc to the Atrocious GM Summit.
 Toronto police are investigating a stabbing near Queens Quay and Lower Jarvis near the Guvernment nightclub.
 I'm in Toronto <3 http://t.co/orjse1DCwz
 Enjoying some quality with my dear friend tomrobertson in Toronto. _sy.

 #samiyusuf #tomrobertson… http://t.co/KSdlfXxYXM
 TrendJSONImpl{name='Taylor', url='http://twitter.com/search?q=Taylor', query='Taylor'}
 “Taylor Swift owned 2014 in a manner not seen since perhaps Britney Spears in the early 2000s.” http://t.co/fahrUjwRYu
 i have so much respect for taylor swift though http://t.co/ffbMEV4Dtj
 Elizabeth Taylor http://t.co/MXZm3gFQ1t
 This is why I respect Taylor so much. http://t.co/5wpvh3KePo
 Elizabeth Taylor, Liza Minelli, Michael Jackson, and Whitney Houston http://t.co/bgYa79Y6uB
 this is so disgusting why is taylor caniff still alive https://t.co/CTpqNtOkwm
 This is why I love Taylor Swift http://t.co/lYHHxfXsyx
 Confession: our New Year's resolution is to dress like Taylor Swift: http://t.co/WcqrivIE0n http://t.co/6W89RU2YPu
 Taylor from Monmouth University http://t.co/TqmJ4ebAJ4
 First game results -
 Me - 104 😏😏😏😏
 Taylor - 101
 Connor - 100
 Dad - 94
 #EASYY
 TAYLOR SWIFT GETS IT http://t.co/ULzUlaxTg6
 I was a Giants’ beat guy in 1986, Lawrence Taylor’s MVP year. I think this season by Watt is better.
 Results from game 2 -
 Me - 111 😏😏
 Taylor - 105
 Connor - 61
 Dad - 55

 Proof that me and Taylor are the best 😏
 Great effort from Connor
 TrendJSONImpl{name='Sens', url='http://twitter.com/search?q=Sens', query='Sens'}
 Les excuses perdent tout leur sens quand elles doivent être dites plus d’une fois.
 Je sens que pendant les 7 jours à venir toutes mes mentions Twitter seront des SqueezieMemes :') #AppliSqueezie
 L'effort ça marche dans les deux sens, pas dans un seul.
 Enfin une journée internationale qui a du sens. http://t.co/n9ZpwNa8Rc
 "La styliste que j'avais à ce moment ne savait pas dans quel sens se portait la robe. En fait, je l'ai portée à +" http://t.co/ly9OosjfS8
 rt si t'es cool et tu te sens pas supérieur
 Perso J'me sens plus représenté par une chaise de jardin que par Hassen Chalghoumi
 sens:  gimme
 nyquist:  nope
 sens:  please
 nyquist:  nope
 sens:  c'mon
 nyquist:  nope
 sens:  dude
 nyquist: *snipe*
 sens:  man
 nyquist:  lol
 J'ai envie de retrouver ma famille, là où j'me sens chez moi: avec vous et avec eux♡

 #FrenchiesWantOTRAT http://t.co/vPKLrHX7rO
 j'ai trop hâte de voir les lives de act my age mdrrrr le live de cette chanson ça va être de la pure folie, ça va partir dans tous les sens
 Même si j'ai peur de l'amour, ta vie donne un sens à mes jours.
 Oublier le sens d'un mot. > Se tapper le crane sur le sol. > Saigner. > Mourrir.
 Gustav Nyquist scores video game goal to lift Wings over Sens http://t.co/vTmM7etqwd
 On se demande parfois si la vie a un sens, puis on rencontre des personnes qui donnent un sens à notre vie.
 J’adore quand je te sens sourire lorsque l’on s’embrasse.
 TrendJSONImpl{name='#CalmDownABand', url='http://twitter.com/search?q=%23CalmDownABand', query='%23CalmDownABand'}
 A normal length of Summer #CalmDownABand
 Mild concern at the disco #CalmDownABand
 Several Directions #CalmDownABand
 involuntary eye movement 182 #CalmDownABand
 #CalmDownABand juan direction #GlobalArtistHMA one direction http://t.co/zpacL5OQQE
 #CalmDownABand my chemical lets just be friends
 #CalmDownABand You Me At 3pm bc 6 is too late
 Cubtooth #CalmDownABand
 #CalmDownABand I Came Out To Have A Good Time And Honestly I'm Feeling So Attacked Right Now! At The Disco
 The Motionless Stones #CalmDownABand
 #CalmDownABand A few general Directions
 Tepid Monkeys #CalmDownABand
 Mild Anxiety At The Disco  #calmdownaband
 #CalmDownABand uncontrollable eyelid movement 182
 #CalmDownABand Nuns N' Moses
 TrendJSONImpl{name='#reasonsniallleftonedirection', url='http://twitter.com/search?q=%23reasonsniallleftonedirection', query='%23reasonsniallleftonedirection'}
 #reasonsniallleftonedirection he wanted to be closer with his sisters http://t.co/ZyhDkfaMlG
 Niall has left 1D to pursue a solo career! Check out the tracklist to his new album

 #reasonsniallleftonedirection http://t.co/TxXaUNF8uv
 But seriously Niall is too 1D af to leave the band

 #reasonsniallleftonedirection http://t.co/6BgNKUz4UD
 Just to confirm, Niall is NOT leaving One Direction. We were hacked, innit. #reasonsniallleftonedirection http://t.co/YRVfSYe5x7
 He was sick of the boys not telling him what they were going to wear #reasonsniallleftonedirection http://t.co/9pKU8IYaNK
 Because he was tired of fans not knowing their basic facts #reasonsniallleftonedirection -A http://t.co/B9IaSZbOFW
 He was tired of Louis always getting them stopped by the police

 #reasonsniallleftonedirection http://t.co/3nT29tOilx
 #reasonsniallleftonedirection

 how is this even possible niall IS the biggest fan of one direction hes 1d af http://t.co/PJN8FgQwZt
 "niall didn't actually leave the band"

 "calm down it's just a joke"
 #reasonsniallleftonedirection
 http://t.co/uwSQvjc5rA
 He was still upset that X Factor spelt his name wrong

 #reasonsniallleftonedirection http://t.co/UekW3kAW4i
 #reasonsniallleftonedirection because they wrote a song about being fireproof but niall is not fireproof http://t.co/e1gyNRkuz6
 he decided to become a professional photographer for one direction

 #reasonsniallleftonedirection http://t.co/4VOEcrR5Gg
 #reasonsniallleftonedirection

 He couldn't take the tension of sitting between Louis and Harry anymore.. http://t.co/yOotH0E40n
 because he was sick of feeling like the fifth wheel

 #reasonsniallleftonedirection
 #ArtistOfTheYearHMA One Direction http://t.co/aM6xFWuvm0
 #reasonsniallleftonedirection the interviewer didnt let him take the group selfie http://t.co/K1bbkCHIuU
 LocationJSONImpl{woeid=3444, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Quebec', url='http://where.yahooapis.com/v1/place/3444'}
 TrendJSONImpl{name='Québec', url='http://twitter.com/search?q=Qu%C3%A9bec', query='Qu%C3%A9bec'}
 #reasonsniallleftonedirection he realized he wasn't fireproof http://t.co/OeYwaCMiE7
 Collège de Valleyfield, Quebec http://t.co/hbx53vT5nh
 the "let's not tell niall" game was too strong he couldn't handle it anymore

 #reasonsniallleftonedirection http://t.co/vXBofC2F59
 (IT) Quebec City e il fiume St. Lawrence vestiti per l'inverno! Il centro storico è patrimonio  mondiale #UNESCO. http://t.co/64cvCUf6o0
 #reasonsniallleftonedirection because he got his own talkshow http://t.co/YRCRyq7bPY
 #reasonsniallleftonedirection

 Because he constantly left out http://t.co/SoiYw8beH1
 #reasonsniallleftonedirection
 to move in with his sisters http://t.co/SYcm0BfMiO
 Can we get a piece of Quebec ?
 ''The boys won more than 55 awards in 2014 only''

 Fandom:
 #ArtistOfTheYearHMA One Direction http://t.co/kQTMcQyj6o
 He is the biggest fan who met them 78324873247437 and more times

 #reasonsniallleftonedirection http://t.co/Mm6Zfkoyum
 ''He followed you''
 ''You have 5/5''
 ''You met them''

 #ThreeWordsSheWantsToHear
 He was tired of people spelling his name wrong

 #reasonsniallleftonedirection http://t.co/6BkCfx9kte
 My Internet best friend when she will meet me http://t.co/eV05DnZ9tc
 This just in, @Fucale31 will start for Canada against Finland. @HC_WJC #WJC2015 @CanadiensMTL @quebec_remparts http://t.co/DhindzLWUj
 REMEMBER WHEN HARRY TWERKED

 #ArtistOfTheYearHMA One Direction

 https://t.co/2rJhBvs4Zq
 TrendJSONImpl{name='Noël', url='http://twitter.com/search?q=No%C3%ABl', query='No%C3%ABl'}
 Noel Baba: Kendi çocuklarına gökten oyuncak, Müslüman çocukları üzerine misket bombaları atan kültürün temsilcisidir. http://t.co/aOfrF5cvhM
 Le plus grand cadeau de Noël du monde fut la Statue de la Liberté. Les français l'ont offert aux États-Unis en 1886.
 Adam gelmiş 2015'den ne bekliyorsun diyor.
 Kardeşim yeni yılın amk.
 2014 neydi ki 2015 de ne olsun.
 Noel babayıda geyikler siksin.
 "Seneye görüşürüz" " 7 hristiyan danaya girmedikçe ben noel kutlamam" █████████████___________| %45 Loading...
 Çok Sevgili Noel Baba;
 Bırak artık şu ışıklı, müzikli, janjanlı hediyeleri.
 Kim kimi seviyorsa,
 Yeni yılda götürüp bırakıver kapısına.
 Bazı insanlardan dürüstlük/samimiyet beklemek..........
 Noel babadan hediye beklemek gibi.......(!)
 Je vous prépare une petite surprise pour ce soir ! Des mois que j'attends ça, c'est mon cadeau de Noël pour vous :d
 Biri noel baba'ya afrika'nin yolunu göstersin madem bu kadar yardımsever. http://t.co/29ggKb5pMn
 MON CADEAU DE NOËL POUR VOUS ! http://t.co/cFLbzcOyR9 #RT si t'aimes bien les cadeaux
 Moi après noël http://t.co/biJ3QjV4pO
 Kar yağmayan yılbaşı olmaz olsun. Küresel ısınmanın da Allah belasını versin. Noel baba da artık bıraksın bu işleri gitsin ayakkabı boyasın.
 Ben anlamam Noel Baba'dan. Biz iki tane baba biliriz; Baba Hakkı ve Müslüm Baba.
 - Que te trajo papá noel?

 - Kilos.
 Bakın bu Noel Baba ne dedi? Hediye dağıtacakmış. Ya sen benim kardeşlerimin evine nasıl bacadan girersin??
 Erkek adam için noel baba yoktur müslüm baba vardır.
 TrendJSONImpl{name='Slovaquie', url='http://twitter.com/search?q=Slovaquie', query='Slovaquie'}
 Le Canada bat la Slovaquie 8-0 et, par le fait même, Fucale obtient son premier blanchissage au Centre Bell. #CMJ2015 http://t.co/OGlazFmNan
 C'est parti pour le match Canada-Slovaquie! #CMJ2015 / Canada-Slovakia is underway here at the Bell Centre! #WJC2015 http://t.co/l71JCGexj3
 Échauffement en cours pour le match Canada-Slovaquie #CMJ2015 / Warmup underway for the Canada-Slovakia game #WJC2015 http://t.co/SL8eif1Gyc
 Trois espoirs du CH sont capitaines de leurs clubs au Championnat junior: De La Rose (Suède), Lehkonen (Finlande) et Reway (Slovaquie).
 Un résumé de la victoire de 8 à 0 du Canada face à la Slovaquie au #CMJ2015. -> http://t.co/PZT0tC5nPY http://t.co/NnVDfAqXyO
 Martin Reway est le joueur du match pour la Slovaquie. #CMJ2015 / Martin Reway is named the Player of the Game for Slovakia. #WJC2015
 Le Canada mène 7 à 0 contre la Slovaquie après 40 minutes. Fucale toujours parfait avec 8 arrêts jusqu'ici. #CMJ2015
 Après 20 minutes, le Canada mène 3 à 0 face à la Slovaquie. Fucale n'a pas été bien occupé, mais est parfait avec 3 arrêts. #CMJ2015
 TrendJSONImpl{name='Montreal', url='http://twitter.com/search?q=Montreal', query='Montreal'}
 RT If you think I should YOLO book a flight up to Montreal to see #ThePack for my million subscriber milestone.
 Jordan Staal will play in tomorrow's game against Montreal.
 On my way to Vegas, Miami & Montreal! #LETSGO
 O'Reilly being offered around the league for a good D-man. Florida and Winnipeg. Pondering, Toronto and Montreal too
 Montreal-area photographer slapped with a $1,000 fine for flying a drone http://t.co/Wmx1RlCoGW
 Wheels up! Next stop Montreal! ✈️
 Perempuan memiliki kecenderungan menjadi lebih stres setelah melihat berita negatif, ketimbang pria. [Peneliti di Montreal, Kanada]
 La police de Montréal demande l'aide de la population afin de retrouver Amine El Alaoui. http://t.co/TxhmtsBA0o http://t.co/R5YcZjYkxm
 Canada posts second straight shutout in 4-0 win over Germany #WJC http://t.co/dOH0IwGf4i http://t.co/P3an9SYMSL
 Landed in Montreal! ✈️ 🍁 😀
 Autumn in #Montreal. http://t.co/cbYIN7xsww
 Many Canadians will instinctively bash Toronto & Montreal for attendance at WJHC. Villain is Hockey Canada greed. Tickets way overpriced.
 “@onlysamsam: @omgAdamSaleh are you planning on coming to Montreal, Canada?? #AskAdamSaleh” yes!! Need to do a proper show there :)
 Charles de Gaulle discutant avec le maire de Montréal Sarto Fournier, avril 1960 #histoire #Montréal http://t.co/NEt1Nn4ttw
 Two Montreal police officers on Christmas Eve graveyard shift help deliver baby in back of car http://t.co/c1aMJxZy5U http://t.co/luPKEu6gwc
 TrendJSONImpl{name='Quebec', url='http://twitter.com/search?q=Quebec', query='Quebec'}
 #reasonsniallleftonedirection he realized he wasn't fireproof http://t.co/OeYwaCMiE7
 Collège de Valleyfield, Quebec http://t.co/hbx53vT5nh
 the "let's not tell niall" game was too strong he couldn't handle it anymore

 #reasonsniallleftonedirection http://t.co/vXBofC2F59
 (IT) Quebec City e il fiume St. Lawrence vestiti per l'inverno! Il centro storico è patrimonio  mondiale #UNESCO. http://t.co/64cvCUf6o0
 #reasonsniallleftonedirection because he got his own talkshow http://t.co/YRCRyq7bPY
 #reasonsniallleftonedirection

 Because he constantly left out http://t.co/SoiYw8beH1
 #reasonsniallleftonedirection
 to move in with his sisters http://t.co/SYcm0BfMiO
 Can we get a piece of Quebec ?
 ''The boys won more than 55 awards in 2014 only''

 Fandom:
 #ArtistOfTheYearHMA One Direction http://t.co/kQTMcQyj6o
 He is the biggest fan who met them 78324873247437 and more times

 #reasonsniallleftonedirection http://t.co/Mm6Zfkoyum
 ''He followed you''
 ''You have 5/5''
 ''You met them''

 #ThreeWordsSheWantsToHear
 He was tired of people spelling his name wrong

 #reasonsniallleftonedirection http://t.co/6BkCfx9kte
 My Internet best friend when she will meet me http://t.co/eV05DnZ9tc
 This just in, @Fucale31 will start for Canada against Finland. @HC_WJC #WJC2015 @CanadiensMTL @quebec_remparts http://t.co/DhindzLWUj
 REMEMBER WHEN HARRY TWERKED

 #ArtistOfTheYearHMA One Direction

 https://t.co/2rJhBvs4Zq
 TrendJSONImpl{name='#BoxingDay', url='http://twitter.com/search?q=%23BoxingDay', query='%23BoxingDay'}
 voila pourquoi #BoxingDay http://t.co/GIigjVf8zC
 California USA Huntington Beach → http://t.co/ECnt04G1rn #BoxingDay 773 Boxing Day sales: I saw a mother use a pushchair as a battering ram…
 → http://t.co/ECnt04G1rn 165 Boxing Day  Boxing Day sales: I saw a mother use a pushchair as a battering ram #BoxingDay Tennessee USA Chatt…
 North Carolina USA Greensboro → http://t.co/kQ3QgjiPgr #BoxingDay 516 Boxing Day bargains attract huge crowds Boxing Day
 → http://t.co/Y7FBnbC5cW Boxing Day Takes A Beating At Black Fridays Hands, But Still A Contender #BoxingDay 897 http://t.co/hao1AYiGSG
 → http://t.co/X45iN60r8V 355 WA shoppers splurge $250 million #BoxingDay Shoppers queue outside Selfrdiges ahead of … http://t.co/giZKjDF2DM
 » NEWS » http://t.co/kQ3QgjiPgr 915 Boxing Day  Boxing Day bargains attract huge crowds #BoxingDay Missouri USA Springfield
 » http://t.co/ECnt04G1rn 935 #BoxingDay Boxing Day Boxing Day sales: I saw a mother use a pushchair as a battering r… http://t.co/ALoLEBoT05
 Blowing for home - the Holcombe Hunt had a few people out on #BoxingDay. Thanks to Nicky for this excellent photo. http://t.co/2f4aWL71BB
 [#BoxingDay] John Terry célébrant son but devant les fans de West Ham ! http://t.co/yCuJ92jC6Q
 Queensland AUS Gold Coast » http://t.co/XODGnzX4bi #BoxingDay 10 Boxing Day sales shoppers clock up 5.7 million transactions with one bank …
 California USA Vallejo → http://t.co/ECnt04G1rn #BoxingDay 517 Boxing Day sales: I saw a mother use a pushchair as a battering ram Boxing D…
 California USA Glendale → http://t.co/Y7FBnbC5cW #BoxingDay 754 Boxing Day Takes A Beating At Black Fridays Hands, But Still A Contender Bo…
 → http://t.co/ECnt04G1rn 19 Boxing Day  Boxing Day sales: I saw a mother use a pushchair as a battering ram #BoxingDay California USA Coron…
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='Christmas', url='http://twitter.com/search?q=Christmas', query='Christmas'}
 multiply is now 6x platinum in the uk, which has matched my first album, which i didn't think i could do. god bless christmas
 Check out this weeks new Christmas themed skit- http://t.co/2EpVlv09iY ! & make sure to subscribe to my channel for weekly videos!
 Glad you guys are enjoying the christmas album! Was fun to make
 https://t.co/i9f15sSevr
 i like it when words sound like their meaning. like how the word "Christmas" sounds all sparkly like Christmas. and "worm" sounds all slimy
 "what did you get for christmas?"

 fat
 Person: what did u get for christmas

 Me: fat
 เวลาฝรั่งพูดว่า you look like a christmas  tree เนี้ยเค้าไม่ใด้ชมว่าแต่งตัวได้สวยงามเหมือนต้นคริสมัสนะ เค้าจิกว่าแต่งตัวมากเกินไป
 Outdoor Christmas Decorations  Giant 6'9' Popcorn by JabberDuck http://t.co/74epiKmgqN http://t.co/LP4iOAX0dj
 Outdoor/ CHRISTMAS DECORATIONS CANDY Decorations Hand by JabberDuck http://t.co/r8mv6Oo1Tu http://t.co/TmvHEBrMPz
 CHRISTMAS DECORATIONS Outdoor CANDY Decorations Hand by JabberDuck http://t.co/obiJEEv6in http://t.co/w7zAllzIxQ
 Niall Horan visits Children's Hospital in Dublin whilst at home over Christmas break http://t.co/a0LqCmBCkY http://t.co/b4xxZNEidl
 my armpits smell like diner pickles. its time to wash this Christmas off
 there are 363 days till Christmas and people already have their Christmas lights up

 unbelievable
 TrendJSONImpl{name='#CalmDownABand', url='http://twitter.com/search?q=%23CalmDownABand', query='%23CalmDownABand'}
 A normal length of Summer #CalmDownABand
 Mild concern at the disco #CalmDownABand
 Several Directions #CalmDownABand
 involuntary eye movement 182 #CalmDownABand
 #CalmDownABand juan direction #GlobalArtistHMA one direction http://t.co/zpacL5OQQE
 #CalmDownABand my chemical lets just be friends
 #CalmDownABand You Me At 3pm bc 6 is too late
 Cubtooth #CalmDownABand
 #CalmDownABand I Came Out To Have A Good Time And Honestly I'm Feeling So Attacked Right Now! At The Disco
 The Motionless Stones #CalmDownABand
 #CalmDownABand A few general Directions
 Tepid Monkeys #CalmDownABand
 Mild Anxiety At The Disco  #calmdownaband
 #CalmDownABand uncontrollable eyelid movement 182
 #CalmDownABand Nuns N' Moses
 TrendJSONImpl{name='#reasonsniallleftonedirection', url='http://twitter.com/search?q=%23reasonsniallleftonedirection', query='%23reasonsniallleftonedirection'}
 #reasonsniallleftonedirection he wanted to be closer with his sisters http://t.co/ZyhDkfaMlG
 Niall has left 1D to pursue a solo career! Check out the tracklist to his new album

 #reasonsniallleftonedirection http://t.co/TxXaUNF8uv
 But seriously Niall is too 1D af to leave the band

 #reasonsniallleftonedirection http://t.co/6BgNKUz4UD
 Just to confirm, Niall is NOT leaving One Direction. We were hacked, innit. #reasonsniallleftonedirection http://t.co/YRVfSYe5x7
 He was sick of the boys not telling him what they were going to wear #reasonsniallleftonedirection http://t.co/9pKU8IYaNK
 Because he was tired of fans not knowing their basic facts #reasonsniallleftonedirection -A http://t.co/B9IaSZbOFW
 He was tired of Louis always getting them stopped by the police

 #reasonsniallleftonedirection http://t.co/3nT29tOilx
 #reasonsniallleftonedirection

 how is this even possible niall IS the biggest fan of one direction hes 1d af http://t.co/PJN8FgQwZt
 "niall didn't actually leave the band"

 "calm down it's just a joke"
 #reasonsniallleftonedirection
 http://t.co/uwSQvjc5rA
 He was still upset that X Factor spelt his name wrong

 #reasonsniallleftonedirection http://t.co/UekW3kAW4i
 #reasonsniallleftonedirection because they wrote a song about being fireproof but niall is not fireproof http://t.co/e1gyNRkuz6
 he decided to become a professional photographer for one direction

 #reasonsniallleftonedirection http://t.co/4VOEcrR5Gg
 #reasonsniallleftonedirection

 He couldn't take the tension of sitting between Louis and Harry anymore.. http://t.co/yOotH0E40n
 because he was sick of feeling like the fifth wheel

 #reasonsniallleftonedirection
 #ArtistOfTheYearHMA One Direction http://t.co/aM6xFWuvm0
 #reasonsniallleftonedirection the interviewer didnt let him take the group selfie http://t.co/K1bbkCHIuU

 Process finished with exit code 0




 /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/bin/java -Didea.launcher.port=7534 "-Didea.launcher.bin.path=/Applications/IntelliJ IDEA 13.app/bin" -Dfile.encoding=UTF-8 -classpath "/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/deploy.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/dt.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/javaws.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jce.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jconsole.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/management-agent.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/plugin.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/sa-jdi.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/charsets.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/classes.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/jsse.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/ui.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/apple_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/dnsns.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/localedata.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunjce_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunpkcs11.jar:/Users/ravindranathakila/ilikeplaces/NewsMute/finagle/target/classes:/Users/ravindranathakila/.m2/repository/Reaver/Reaver/1.0.4-SNAPSHOT/reaver-1.0.4-SNAPSHOT.jar:/Users/ravindranathakila/.m2/repository/com/google/inject/guice/2.0/guice-2.0.jar:/Users/ravindranathakila/.m2/repository/aopalliance/aopalliance/1.0/aopalliance-1.0.jar:/Users/ravindranathakila/.m2/repository/com/google/inject/extensions/guice-assisted-inject/2.0/guice-assisted-inject-2.0.jar:/Users/ravindranathakila/.m2/repository/net/sf/oval/oval/1.81/oval-1.81.jar:/Users/ravindranathakila/.m2/repository/Scribble/Scribble/1.0.1-SNAPSHOT/scribble-1.0.1-SNAPSHOT.jar:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-core_2.9.2/6.6.2/finagle-core_2.9.2-6.6.2.jar:/Users/ravindranathakila/.m2/repository/org/scala-lang/scala-library/2.9.2/scala-library-2.9.2.jar:/Users/ravindranathakila/.m2/repository/io/netty/netty/3.6.6.Final/netty-3.6.6.Final.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-app_2.9.2/6.5.0/util-app_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-core_2.9.2/6.5.0/util-core_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-collection_2.9.2/6.5.0/util-collection_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/google/guava/guava/15.0/guava-15.0.jar:/Users/ravindranathakila/.m2/repository/commons-collections/commons-collections/3.2.1/commons-collections-3.2.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-hashing_2.9.2/6.5.0/util-hashing_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-jvm_2.9.2/6.5.0/util-jvm_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-logging_2.9.2/6.5.0/util-logging_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-http_2.9.2/6.6.2/finagle-http_2.9.2-6.6.2.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-codec_2.9.2/6.5.0/util-codec_2.9.2-6.5.0.jar:/Users/ravindranathakila/.m2/repository/commons-codec/commons-codec/1.5/commons-codec-1.5.jar:/Users/ravindranathakila/.m2/repository/commons-lang/commons-lang/2.6/commons-lang-2.6.jar:/Users/ravindranathakila/.m2/repository/com/datastax/cassandra/cassandra-driver-core/2.0.0-beta2/cassandra-driver-core-2.0.0-beta2.jar:/Users/ravindranathakila/.m2/repository/org/codehaus/jackson/jackson-core-asl/1.9.13/jackson-core-asl-1.9.13.jar:/Users/ravindranathakila/.m2/repository/org/codehaus/jackson/jackson-mapper-asl/1.9.13/jackson-mapper-asl-1.9.13.jar:/Users/ravindranathakila/.m2/repository/com/codahale/metrics/metrics-core/3.0.1/metrics-core-3.0.1.jar:/Users/ravindranathakila/.m2/repository/org/slf4j/slf4j-api/1.7.5/slf4j-api-1.7.5.jar:/Users/ravindranathakila/.m2/repository/org/xerial/snappy/snappy-java/1.0.5/snappy-java-1.0.5.jar:/Users/ravindranathakila/.m2/repository/net/jpountz/lz4/lz4/1.2.0/lz4-1.2.0.jar:/Users/ravindranathakila/.m2/repository/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/Users/ravindranathakila/.m2/repository/org/jsoup/jsoup/1.7.2/jsoup-1.7.2.jar:/Users/ravindranathakila/.m2/repository/rome/rome/1.0/rome-1.0.jar:/Users/ravindranathakila/.m2/repository/jdom/jdom/1.0/jdom-1.0.jar:/Users/ravindranathakila/.m2/repository/org/mindrot/jbcrypt/0.3m/jbcrypt-0.3m.jar:/Users/ravindranathakila/.m2/repository/com/hazelcast/hazelcast/3.1.2/hazelcast-3.1.2.jar:/Users/ravindranathakila/.m2/repository/com/sun/jersey/jersey-client/1.18.1/jersey-client-1.18.1.jar:/Users/ravindranathakila/.m2/repository/com/sun/jersey/jersey-core/1.18.1/jersey-core-1.18.1.jar:/Users/ravindranathakila/.m2/repository/org/twitter4j/twitter4j-core/4.0.2/twitter4j-core-4.0.2.jar:/Applications/IntelliJ IDEA 13.app/lib/idea_rt.jar" com.intellij.rt.execution.application.AppMain ai.newsmute.service.Influencer
 Open the following URL and grant access to your account:
 https://api.twitter.com/oauth/authorize?oauth_token=iFitFdW2qz7LHZ8bDkeCnAdvP5IEs6CC
 Enter the PIN(if aviailable) or just hit enter.[PIN]:5937243
 LocationJSONImpl{woeid=1, countryName='', countryCode='null', placeName='Supername', placeCode='19', name='Worldwide', url='http://where.yahooapis.com/v1/place/1'}
 TrendJSONImpl{name='#HappyVday', url='http://twitter.com/search?q=%23HappyVday', query='%23HappyVday'}
 #HappyVday Fans and BTS celebrate the birthday of member V on Twitter! http://t.co/BO1Myxxklk http://t.co/bLvlQTGEct
 http://t.co/BO1Myxxklk
 http://www.allkpop.com/article/2014/12/fans-and-bts-celebrate-the-birthday-of-member-v-on-twitter
 Happy Birthday to #BTS' V! #HappyVDay http://t.co/D9N2s9Ggzi
 [FACEBOOK] 20th Happy 'V'irthday 2014 #HappyVday @BTS_twt http://t.co/OSj4t3uAab
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/cmgZ5IFYDH
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/r2y4fS2PqJ
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt SELF_V http://t.co/MuIkN9SH7g
 {Pls RT} D-1 Going away from tradition (again)....let's trend #HappyVday as soon as clock ticks 12 midnight tonight! http://t.co/XhASWmimGv
 [EPISODE] HAPPY BIRTHDAY V ! #HappyVday @BTS_twt http://t.co/u5e4NraspL
 It's time! V ! 생일축하해! Happy Birthday! We loVe you! #HappyVday @BTS_twt @bts_bighit @BigHitEnt - From #BTSARMY Crew http://t.co/oObtha7ZgV
 สุขสันต์วันเกิดนะวีวี่ #HappyVday เป็นบังทันที่อาร์มี่ภูมิใจตลอดไปนะ เราจะเป็นอาร์มี่ให้คุณภูมิใจตลอดไป ^^  @BTS_twt http://t.co/mg4rHSBXQd
 TrendJSONImpl{name='#Replace5SOSLyricsWithToast', url='http://twitter.com/search?q=%23Replace5SOSLyricsWithToast', query='%23Replace5SOSLyricsWithToast'}
 When you change your mind I'll be waiting
 'Cause I'm better than toast.
 #Replace5SOSLyricsWithToast #5secondsoftoast http://t.co/ZP7XaSfLqg
 u look so perfect standing there in my cinnamon toast crunch underwear

 #5SecondsOfToast #Replace5SOSLyricsWithToast http://t.co/XyvynDB48Q
 i play guitar but shes into toasters #Replace5SOSLyricsWithToast http://t.co/bSPKct92Ir
 I dedicate this TOAST to you 🍞 -alex
 #Replace5SOSLyricsWithToast http://t.co/TS3SAVTmdP
 she looks so perfect standing there... and i'm eating my toast in my underwear  #Replace5sosLyricsWithToast http://t.co/4rOgalNZye
 You walked in, everyone was asking for your name, you just smiled and told them "toast"

 #Replace5soslyricswithtoast
 So we're taking the long way home 'cause I don't wanna be wasting my toast alone

 #Replace5soslyricswithtoast
 #5SecondsOfToastFollowParty
 Heartbreak Toast
 Beside Toast
 What I Like About Toast
 Heartache on the big toast
 #Replace5SOSLyricsWithToast
 This is too much its really stupid I'm so weird but I can't help it.
 #Replace5SOSLyricsWithToast http://t.co/ZKCkh805vI
 When you change your mind i'll be toasting just saying #Replace5SOSLyricsWithToast
 Cause good toasts are bad toasts that haven't been caught #Replace5SOSLyricsWithToast
 good girls are bad girls that haven't been toast

 #Replace5sosLyricsWithToast
 you call me up it´s like a toasted record #Replace5SOSLyricsWithToast
 im a piece of toast but shes into waffles
 #Replace5SOSLyricsWithToast http://t.co/gK1nnD1XhQ
 i cant forget my french toast love affair #Replace5sosLyricsWithToast http://t.co/v4vnEiHhXe
 TrendJSONImpl{name='#PKdebate', url='http://twitter.com/search?q=%23PKdebate', query='%23PKdebate'}
 Should it not be left to the audience to decide whether or not they agree or disagree with the movie? #PKdebate http://t.co/00iN7grUI2
 'Jodhaa Akbar' was banned in MP & Rajasthan for allegedly distorting historical facts! Catch in to the #PKdebate http://t.co/F1MiPRwEqn
 Indian society is very matured and freedom of expression also means freedom of protest: Rahul Easwar, Social Activist #PKdebate
 They have made a mockery of democracy and they would not have done it if Hansal Mehta was PK: Hansal Mehta #PKdebate
 Aamir sells movie out of Contro, Fringe Groups get popularity by protests, media gets TRP by showing, Iam the fool watching #PKDebate. Thx.
 If the censor board has cleared the movie, are the fringe groups going against a government appointed body? #PKdebate http://t.co/W63QkPfV4f
 Controversy for Aamir isn't new. Fanaa was banned in Gujarat for a while. Tune in, #PKdebate on @thenewshour http://t.co/cSLBvj1zCS
 What constitutes free speech in India?
 - Abuse India, Hindus and Hinduism,
 - Paint Muslims as victims
 - call it a art

 #PKdebate
 The courts have dismissed the petition against screening of the movie #PK, are fringe mocking a court order? Don't miss the #PKdebate
 I am warning theaters to stop screening PK, or, we will intensify our protest: Ahmedabad Bajrang Dal Chief Jwalit Mehta #PKdebate
 Why was the Shiv Sena irked over 'My Name is Khan'? Find out as we get closer to the #PKdebate on @thenewshour http://t.co/Jq6bkiWeqW
 Can vandalism be justified by fringe group protest? Isn't the silent of the Centre emboldening them? Next on @thenewshour: #PKdebate
 There is just one victim in this whole drama and it is the democracy: Hansal Mehta, Director & Writer #PKdebate
 This is no way to protest, this is vandalism to create chaos: Shobhaa De, Author & Columnist #PKdebate
 TrendJSONImpl{name='#WeDemandFifthHarmony', url='http://twitter.com/search?q=%23WeDemandFifthHarmony', query='%23WeDemandFifthHarmony'}
 Sobre o #WeDemandFifthHarmony ele conta apenas um "voto" por conta, não adianta ficar tweetando x100 pois não alterará em nada
 Los fans de @FifthHarmony están hablando! TT en España: #WeDemandFifthHarmony
 Quem ai gostaria de ver as meninas em São Paulo denovo? Tweetem
 #WeDemandFifthHarmony São Paulo
 Fifth Harmony em 2015 podia fazer que nem o RBD em 2006, fazer shows no Brasil todo #WeDemandFifthHarmony assim todo mundo saia ganhando
 #WeDemandFifthHarmony São Paulo
 Es mejor que vengan a Madrid y les guste y vuelvan más tarde a otras ciudades, que directamente no vengan #WeDemandFifthHarmony Madrid
 São Paulo #WeDemandFifthHarmony
 Retweet to let @FifthHarmony know you want a show in your city! #WeDemandFifthHarmony @WeDemand See top cities: http://t.co/Ej6TewpSB9
 http://t.co/Ej6TewpSB9
 http://www.wedemand.com/fifthharmony?r
 #WeDemandFifthHarmony Rio de Janeiro
 Quem ai é de Recife ou região e gostaria de ver as meninas por ai? Tweeta
 #WeDemandFifthHarmony Recife
 #WeDemandFifthHarmony http://t.co/XJilATHGl5
 if the girls have already come and go to your city like more than twice a year can you not tweet this tbfh #WeDemandFifthHarmony
 O TOP 10 do #WeDemandFifthHarmony e pode ser encontrado no site http://t.co/Qe8o7AMDyU http://t.co/J8Iy1MMfsf
 http://t.co/Qe8o7AMDyU
 http://www.wedemand.com/fifthharmony
 Recordar que es muy difícil que vayan a otra ciudad que no sea la capital,ya que será la primera vez que vengan #WeDemandFifthHarmony Madrid
 TrendJSONImpl{name='#LinesPagNagseselos', url='http://twitter.com/search?q=%23LinesPagNagseselos', query='%23LinesPagNagseselos'}
 Baka naman nakakaistorbo ako. #LinesPagNagseselos
 Matutulog na ako. Night #LinesPagNagseselos
 Mga kadalasang linya pag nagseselos:

 -Oh talaga?
 -Tss
 -Magsama kayo
 -Ah ganun?
 -Ah...ok

 at higit sa lahat:
 -K

 #LinesPagNagseselos
 #LinesPagNagseselos http://t.co/KRO8lnxPnV
 #LinesPagNagseselos http://t.co/bbocVKCgtl
 #LinesPagNagseselos http://t.co/o4lUnmL6M3
 #LinesPagNagseselos http://t.co/f2i2W8zBIN
 #LinesPagNagseselos http://t.co/mcsPM6Pqi9
 #LinesPagNagseselos http://t.co/gUCYwReZ6r
 #LinesPagNagseselos http://t.co/yR1o0uBeF9
 #LinesPagNagseselos http://t.co/uRoMN3YV4O
 #LinesPagNagseselos http://t.co/LnMJG8JsAr
 #LinesPagNagseselos http://t.co/I2WdqDuZtj
 Tagal magreply a. Ge text ka na lang pag free ka na #LinesPagNagseselos
 Text ka na lang kapag may time ka na sakin. #LinesPagNagseselos
 TrendJSONImpl{name='Pardew to Palace', url='http://twitter.com/search?q=%22Pardew+to+Palace%22', query='%22Pardew+to+Palace%22'}
 BREAKING: Alan Pardew poised to join Crystal Palace after Newcastle agree compensation fee http://t.co/FQ9C4g2bc6 http://t.co/v6vGZeSLdt
 http://t.co/FQ9C4g2bc6
 http://dailym.ai/1xcgy9F
 Can you really blame Alan Pardew for wanting to swap Newcastle with Crystal Palace?! http://t.co/ROWWX5rY40
 BREAKING: Alan Pardew to become new Crystal Palace boss after clubs agreed compensation - http://t.co/7rcR3BGc4x http://t.co/Uj4BLUhNrC
 http://t.co/7rcR3BGc4x
 http://sunpl.us/6019vtG5
 Klopp to Palace, Pardew to Dortmund, Warnock to Newcastle and Alan Curbishley will continue to hang out by the bins at Sky Studios #ITK
 Reports suggesting that Pardew to Palace is a done deal, and why the f*ck not? https://t.co/IBHHTOoQV9
 https://t.co/IBHHTOoQV9
 https://vine.co/v/MLT1uxMbuHx
 Alan Pardew set for Palace talks in next 48 hours.Clubs close to agreement on compensation & Toon boss open to London return.#nufc #cpfc
 Pardew to Palace? It's the gossip... http://t.co/A9YDo4abyE #nufc #cpfc http://t.co/nAa9WNrCGq
 http://t.co/A9YDo4abyE
 http://bbc.in/1vl6DsU
 Pardew hoping to leave Newcastle by mutual consent to join Palace, reports @neilashton_ http://t.co/qHtcr6DQyR http://t.co/0Mb1i4gSFE
 http://t.co/qHtcr6DQyR
 http://dailym.ai/13En9NZ
 Pardew goes odds-on for Crystal Palace job after press conference no show. More here: http://t.co/R5uajHfnKS http://t.co/QUIunAgDwR
 http://t.co/R5uajHfnKS
 http://bit.ly/1HUFCU4
 Crystal Palace identify Alan Pardew as first choice and are expected to talk to him this week http://t.co/nWFETiW1Jr http://t.co/AxosyAKIRl
 http://t.co/nWFETiW1Jr
 http://www.telegraph.co.uk/sport/football/teams/newcastle-united/article11315585.ece?token=2106152096
 Newcastle press officer stops Carver from answering questions on reports linking Pardew to Crystal Palace vacancy.
 #NUFC - Betting suspended on Pardew moving to Crystal Palace http://t.co/vokIURchEh
 http://t.co/vokIURchEh
 http://bit.ly/1zLabMD
 Newcastle yet to agree compensation deal with Crystal Palace for Alan Pardew - via @SkySports_Keith #SSNHQ
 TrendJSONImpl{name='KaliteliTT Whats507x185x5302', url='http://twitter.com/search?q=%22KaliteliTT+Whats507x185x5302%22', query='%22KaliteliTT+Whats507x185x5302%22'}
 "KaliteliTT Whats507x185x5302" 18:26'da TT'de 10. sırada! Analiz > http://t.co/n9v1VzEZjt
 http://t.co/n9v1VzEZjt
 http://www.starmetre.com/trend-175009.html
 TrendJSONImpl{name='1 Billion', url='http://twitter.com/search?q=%221+Billion%22', query='%221+Billion%22'}
 Worth $7.3 billion, Nigeria's Folorunsho Alakija 62 unseats Oprah Winfrey as the richest black woman in the world. http://t.co/ESbCu8kHVk
 Pope Francis expected to instruct one billion Catholics to act on climate change http://t.co/na0Fi2RaRv http://t.co/Qf7WeIFnpf
 http://t.co/na0Fi2RaRv
 http://thkpr.gs/3607083
 Since the rise of Islamic State Iran has sent over 1,000 military advisers, spent $1 billion on military aid to Iraq http://t.co/tM9SiQmyV4
 http://t.co/tM9SiQmyV4
 http://wapo.st/1JWhHY5
 The average snowflake is made of 180 billion molecules of water and falls at 3.1 mph. http://t.co/SNx7sTk6yF
 Xiaomi just confirmed it raised $1.1 billion in new funding at a remarkable $45 billion valuation: http://t.co/XB25imnIRj
 http://t.co/XB25imnIRj
 http://onforb.es/1Bfdn0m
 Food For The Poor received gifts, mainly donated goods, valued at $1 billion this year: http://t.co/NxgJ2iF95Q http://t.co/ExOLh5Grle
 http://t.co/NxgJ2iF95Q
 http://onforb.es/1wAvqgq
 Shokat Khanum Peshawar shall be delayed for one complete year if we are unable to collect 1.5 Billion Rupees in one month #TwentyYearsOfSKMH
 Xiaomi raises $1.1 billion to become the world's most valuable startup http://t.co/xrvGlm9E8J
 http://t.co/xrvGlm9E8J
 http://on.mash.to/148UlOY
 He inherited debt of £760 billion (2010) He has "reduced" it to £1260 billion (2014) (Maths not his strongest point) http://t.co/QvpBl85P8X
 400 BILLION! RT The richest person to ever live was this black man 😳 http://t.co/ZeCGkByYSC http://t.co/0JpgHQOh1P
 http://t.co/ZeCGkByYSC
 http://reiations.com/1bNSLz0
 Burnley draws with Manchester City. In other words, the cheapest BPL team is equal to the most expensive. So £5 million = £1 billion. #logic
 Quran is Followed by more than 1 billion people,with its eternal principles,guides us to the shortest and most illuminated road to happiness
 Spending $1 million/day, it would take 218 years to deplete Bill Gates’ $79 billion wealth

 http://t.co/9E3BovoEra http://t.co/Xx5UBcfr6P
 http://t.co/9E3BovoEra
 http://www.theguardian.com/news/datablog/2014/oct/29/oxfam-report-220-years-richest-man-spend-wealth
 Some scientists believe 75 percent of life on Earth may become extinct by 2200: http://t.co/eTlNYYyC98 http://t.co/SCqMF6m1IL
 http://t.co/eTlNYYyC98
 http://bit.ly/1z0gGLh
 Elizabeth Holmes started her blood diagnostics company at age 19. It's now worth $9 billion http://t.co/LmCzy84OXB http://t.co/1g6sSuFwIh
 http://t.co/LmCzy84OXB
 http://for.tn/1tp7wqg
 TrendJSONImpl{name='ÜlkeYanıyor HükümetSaçTarıyor', url='http://twitter.com/search?q=%22%C3%9ClkeYan%C4%B1yor+H%C3%BCk%C3%BCmetSa%C3%A7Tar%C4%B1yor%22', query='%22%C3%9ClkeYan%C4%B1yor+H%C3%BCk%C3%BCmetSa%C3%A7Tar%C4%B1yor%22'}
 Cizre bu ülkenin toprağı değil mi? Hükümetin niye sesi çıkmıyor?!
 ÜlkeYanıyor HükümetSaçTarıyor
 İhanetle, provokasyonu karıştıranlar ülke yönetemez.! [ ÜlkeYanıyor HükümetSaçTarıyor ]
 pkk yol kesip kimlik kontrol ediyor.
 Bayrağımız İndiriliyor. Devlet nerde?
 ÜlkeYanıyor HükümetSaçTarıyor
 domuz sürüsü yol kesip kimlik kontrol ediyor,
 kaymakam atayıp para basıyor
 ÜlkeYanıyor HükümetSaçTarıyor
 aKP, memleket yanarken görmezden gelip, memleketi yakanları temize çıkarmaya çalışmaktadır. [ ÜlkeYanıyor HükümetSaçTarıyor ]
 ÜlkeYanıyor HükümetSaçTarıyor
 TrendJSONImpl{name='Ramiro Costa', url='http://twitter.com/search?q=%22Ramiro+Costa%22', query='%22Ramiro+Costa%22'}
 Ramiro Costa parte a préstamo: http://t.co/pw0yD81jub #LosCruzados http://t.co/ENkFw8crZs
 http://t.co/pw0yD81jub
 http://goo.gl/Wd9rXn
 Ramiro Costa llega a la Calera por un valor de 12 dulces de La Ligua
 Ramiro Costa dejó la #UC y llegó a préstamo a #ULaCalera http://t.co/AEQcI6C8BA http://t.co/UFUKUy7Fnb
 http://t.co/AEQcI6C8BA
 http://bit.ly/13EBhqy
 Qué hacen con la plata los clubes? Mire La Calera. Vende en más de un US$ 1 millón a Benegas y lo "reemplaza" con Ramiro Costa a costo cero
 El primer cortado: Ramiro Costa parte a prestamo a La Calera http://t.co/NaOx0NgXgl #LosCruzados
 http://t.co/NaOx0NgXgl
 http://bit.ly/1HVP89q
 Católica tiene su primer refuerzo. Se fue Ramiro Costa.
 Ramiro Costa vistiendo @ULaCaleraSADP #LosCruzados http://t.co/Pk0K3e0IHn
 ONEMI INFORMA | Ramiro Costa anota 2 goles en un partido, junte agua y diríjase a la zona de seguridad mas cercana. #LosCruzados #onemi
 LocationJSONImpl{woeid=2972, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Winnipeg', url='http://where.yahooapis.com/v1/place/2972'}
 TrendJSONImpl{name='Winnipeg', url='http://twitter.com/search?q=Winnipeg', query='Winnipeg'}
 O'Reilly being offered around the league for a good D-man. Florida and Winnipeg. Pondering, Toronto and Montreal too
 I have arrived in Winnipeg and packed correctly for #mnwild #nhljets game http://t.co/MCXSFGhmyZ
 #mnwild on ice before heading to Winnipeg. No Backstrom, Zucker, Granlund or Brodin http://t.co/r0PAkdeRx3
 Extreme cold warnings issued for Winnipeg and much of southern Manitoba, as wind-chills touch -40 tonight. http://t.co/vLBwIZVghe
 http://t.co/vLBwIZVghe
 http://www.cjob.com/2014/12/28/deep-freeze-hits-winnipeg/
 #mnwild and #NHLJets tonight at 7 in Winnipeg! Where are you watching/listening from? #MINvsWPG http://t.co/vqJagGn7RG
 #mnwild plane getting ready to depart MSP for Winnipeg. Game Monday! http://t.co/nwGdLuYT0i
 Protesters hold round dance at Winnipeg's Portage Place mall http://t.co/jjbUZV0enL http://t.co/RnrOxsjAcB
 http://t.co/jjbUZV0enL
 http://www.cbc.ca/news/canada/manitoba/protesters-hold-round-dance-at-winnipeg-s-portage-place-mall-1.2884449?cmp=rss
 Environment Canada says it will issue Extreme Cold Warnings for #Winnipeg and southern Manitoba this afternoon as windchills touch -40.
 Josh Morrissey made sure fellow Winnipeg Jets prospect Eric Comrie got the game puck after his 1st career WJHC game/shutout
 #mnwild coach Mike Yeo: Backstrom, Granlund, Brodin and Zucker not going to Winnipeg. Severity of Granlund/Brodin injuries still uncertain.
 STAR-7 (Winnipeg) has been dispatched for an inter-hospital transport in the Crystal City, MB area.
 EXTREME COLD WARNING: in effect for all of #Manitoba wind chills expected to reach -40 to -45 overnight. Bundle up! #cbcmb #Winnipeg #Bdnmb
 AccuWeather RealFeel® temp in Winnipeg, Manitoba, is -37 C (-35 F); air temp is -28 C (-18 F):  http://t.co/IObGS1RBOE
 http://t.co/IObGS1RBOE
 http://ow.ly/GwluV
 No top 5 this past weekend, so instead, a top 10 NYE parties in Winnipeg column: http://t.co/bLNNvl5cd7 #cbcmb http://t.co/MNNkQ5kslQ
 http://t.co/bLNNvl5cd7
 http://www.cbc.ca/1.2879213
 TrendJSONImpl{name='New Years', url='http://twitter.com/search?q=%22New+Years%22', query='%22New+Years%22'}
 This is me on New Years. http://t.co/VrbGCq36V1
 So do you all have your New Years resolutions ready??
 RT if you want us to make a "Like That" music video right after New Years!
 Who's kissing me on New Years
 Alcohol or my tears
 Me on new years  http://t.co/w0uZOkPYnT
 http://t.co/w0uZOkPYnT
 http://vine.co/v/OvId1m0jAuv
 New Years resolution 👌 http://t.co/S7ZT5u9Pdz
 New Years resolution: http://t.co/PxQVgnaawB
 #NashsChristmasSkit Hope you liked the video! I can't wait to show you my New Years Skit! Subscribe to my channel!!! http://t.co/2EpVlv09iY
 http://t.co/2EpVlv09iY
 http://youtu.be/_kH7XBWLUck
 New Years resolution: http://t.co/KcakWvl1MZ
 This is me on New Years. http://t.co/Hmia6N9Sd1
 Kinda want a New Years kiss kinda want 10 shots of tequila instead
 i've never had a new years kiss, or a mistletoe kiss but i did have a hershey's kiss and it was spectacular
 New Years resolution: http://t.co/TqtkPWzSnJ
 New Years resolution 🙏🙌 http://t.co/uXK5jqllpC
 New Years Resloution: http://t.co/HTOFWHRU6S
 TrendJSONImpl{name='Wild', url='http://twitter.com/search?q=Wild', query='Wild'}
 Every child born from now on is at risk of never seeing an elephant or a rhino in the wild http://t.co/uYBYRDywgB http://t.co/JPfmjawJ0h
 http://t.co/uYBYRDywgB
 http://virg.in/kOxJg
 new years resolution....
 1080 dpi
  *drumkit explodes crowd goes wild baby jesus dunks microphone into glass of blood orange s. pellegrino*
 NFC Wild Card Round games:
 • Detroit at Dallas
 • Arizona at Carolina
 WILD CARD SUNDAY LATE AFTERNOON

 @Lions vs. @dallascowboys

 4:40 PM ET on FOX
 #방탄소년단 ‘DARK&WILD’ 공개방송 출석 이벤트 당첨자 안내
 http://t.co/uJ5jej8aIT
 http://t.co/uJ5jej8aIT
 http://cafe.daum.net/BANGTAN/k2Of/10
 Heyecan ve tehlike kol kola geziyor. Birbirlerinin facebook şifresini bilen sevgililer, Nat Geo Wild'da.
 NFC Playoff Schedule Wild Card weekend is set:
 • Cardinals at Panthers (Saturday, 4:35 ET on ESPN)
 • Lions at Cowboys (Sunday, 4:40 ET)
 The Ravens just flew their way into the playoffs. That's pretty wild right there. They're also the Wild Card. That's even more wild, man
 AFC Wild Card Weekend schedule:
 • Ravens at Steelers (Saturday, 8:15 ET)
 • Bengals at Colts (Sunday, 1:05 ET)
 WILD CARD SUNDAY

 1:05 PM ET on CBS

 If CIN wins tonight:

 @Ravens vs. @Bengals

 If PIT wins tonight:

 @Bengals vs. @Colts
 Trying to understand AFC Wild Card scenarios... http://t.co/rKgJ3HDuiw
 http://t.co/rKgJ3HDuiw
 http://twitter.com/SportsNation/status/549303894120333312/photo/1
 So on wild-card weekend, it's Detroit at Dallas, and Arizona at Carolina.
 The Ravens will travel to Pittsburgh for a wild-card game next Saturday night.

 READ: http://t.co/REGTO1bp7J http://t.co/hSamd8lniL
 http://t.co/REGTO1bp7J
 http://rvns.co/2xk
 Wild Card Weekend:

 Sat:
 • ARI at CAR - 4:35p ET, ESPN
 • BAL at PIT - 8:15p ET

 Sun:
 • CIN at IND - 1:05p ET
 • DET at DAL - 4:40p ET
 larry in 2014...well November was pretty wild http://t.co/Sn4ib6GIAe
 TrendJSONImpl{name='Don Cherry', url='http://twitter.com/search?q=%22Don+Cherry%22', query='%22Don+Cherry%22'}
 Don Cherry: #Oilers' Nail Yakupov "a little coward" for hit he delivered earlier this week. http://t.co/e2x8SSB3Vv http://t.co/RHq3L8U3Us
 http://t.co/e2x8SSB3Vv
 http://ow.ly/GuwdS
 Don Cherry isn't messing around tonight. http://t.co/agBNTjOHPu
 Suit up. Don Cherry is coming to Netflix. http://t.co/0gtxHypTZD
 http://t.co/0gtxHypTZD
 http://nflx.it/1CqUHyd
 TrendJSONImpl{name='Christmas', url='http://twitter.com/search?q=Christmas', query='Christmas'}
 multiply is now 6x platinum in the uk, which has matched my first album, which i didn't think i could do. god bless christmas
 Check out this weeks new Christmas themed skit- http://t.co/2EpVlv09iY ! & make sure to subscribe to my channel for weekly videos!
 http://t.co/2EpVlv09iY
 http://youtu.be/_kH7XBWLUck
 Glad you guys are enjoying the christmas album! Was fun to make
 https://t.co/i9f15sSevr
 https://t.co/i9f15sSevr
 https://itunes.apple.com/gb/album/meet-vamps-christmas-edition/id925655725
 i like it when words sound like their meaning. like how the word "Christmas" sounds all sparkly like Christmas. and "worm" sounds all slimy
 "what did you get for christmas?"

 fat
 Person: what did u get for christmas

 Me: fat
 เวลาฝรั่งพูดว่า you look like a christmas  tree เนี้ยเค้าไม่ใด้ชมว่าแต่งตัวได้สวยงามเหมือนต้นคริสมัสนะ เค้าจิกว่าแต่งตัวมากเกินไป
 Outdoor Christmas Decorations  Giant 6'9' Popcorn by JabberDuck http://t.co/74epiKmgqN http://t.co/LP4iOAX0dj
 http://t.co/74epiKmgqN
 http://etsy.me/1yUZjru
 Outdoor/ CHRISTMAS DECORATIONS CANDY Decorations Hand by JabberDuck http://t.co/r8mv6Oo1Tu http://t.co/TmvHEBrMPz
 http://t.co/r8mv6Oo1Tu
 http://etsy.me/1plt58V
 CHRISTMAS DECORATIONS Outdoor CANDY Decorations Hand by JabberDuck http://t.co/obiJEEv6in http://t.co/w7zAllzIxQ
 http://t.co/obiJEEv6in
 http://etsy.me/1uT1Kf6
 Niall Horan visits Children's Hospital in Dublin whilst at home over Christmas break http://t.co/a0LqCmBCkY http://t.co/b4xxZNEidl
 http://t.co/a0LqCmBCkY
 http://on.sugarsca.pe/1zpDAXr
 my armpits smell like diner pickles. its time to wash this Christmas off
 there are 363 days till Christmas and people already have their Christmas lights up

 unbelievable
 TrendJSONImpl{name='Polo', url='http://twitter.com/search?q=Polo', query='Polo'}
 김현준 : เมนูอาหารของ Viva Polo ที่แนะนำคือ!??!!? วันนี้ว่าจะไปแหละ!!!
 ชาน: Kimchi Arrabiata ครับ!
 Así que fuimos hasta mi casa «que es el polo», le advertí, «con un colchón nos basta, de estufa, corazón, te tengo a ti»
 Viajar a Disney con @sofmorin toda una experiencia jaja ✌️ http://t.co/ae1GUG89Yo
 From Djokovic and Water-Polo domination to the Basketball World Cup finals, Serbia land of sport 2014! http://t.co/N7DTuGNX09
 104. Did U know settlers R recorded as placing Aboriginal babies into sand with head out &using polo mallets 2 cause death
 #blackfullafacts
 [TRANS] 141228 CHANYEOL EXO-L Chat

 Chanyeol: Kimchi Arabiatta!!

  *isn't that his fave dish from Viva Polo >< http://t.co/o67PJha3MZ
 salir a la calle y correr el riesgo de salir volando hasta el polo norte.
 Me pierdo de polo a polo en encontrar alguien con quien poder reír poder llorar. #FrasesDeLPDA
 @piersmorgan shouldn't you support a polo team or a yachting club. But working class for your sort this football lark, eh?
 -Viajaré al Polo Norte a admirar los hielos esos gigantes...
 -¿Iceberg?
 -Pues claro que se ven, si son gigantes te he dicho
 -Mejor no vayas
 Sebastien Ogier and Julien Ingrassia played it cool, driving their Polo R WRC to victory at Rally Sweden 2013. http://t.co/nszDUTUeyr
 NOVE QUE RASCA HACE COMPARE, HA VENÍO PAPÁ NOÉ Y SA TRAÍO AQUÍ TOR FRÍO DER POLO NORTE ER MAMÓN.
 Tras debacle en alcaldía del Polo, candidata del Polo encabeza encuestas para alcaldía de Bogotá. #alobien #especial28
 La soltería se disfruta, una relación se respeta. Así de simple.
 Senador Robledo, el Centro Democrático apoya solo algunos temas legislativos del gobierno que ayudó a elegir su partido, el Polo Democrático
 TrendJSONImpl{name='Petan', url='http://twitter.com/search?q=Petan', query='Petan'}
 Canada lines v Germany:

 Domi-Reinhart-Duclair
 Ritchie-McDavid-Lazar
 Paul-Petan-Fabbri
 Crouse-Gauthier/Point-Virtanen
 VIDEO: Nic Petan demonstrates quick feet attack moves: http://t.co/2ZPLDVEQL0 @SportChek Hockey Skills. #HereWeGo http://t.co/tb8Ax1vyRL
 http://t.co/2ZPLDVEQL0
 http://bit.ly/1vBCmqX
 Gauthier (84.2%) is No. 1 in #WJC2015 faceoff pct. Reinhart is 5th (69.7), Petan & McDavid: 50.0. Canada is at 63.8%. http://t.co/wTKJlpECWo
 Petan shelfs it in this goal! 😱
 https://t.co/VSWXSfhp9s
 https://t.co/VSWXSfhp9s
 https://vine.co/v/OHDxuJXHtHJ
 Petan with a beauty goal #2015WJC
 https://t.co/M01adrN9tk
 https://t.co/M01adrN9tk
 https://vine.co/v/OHDxuJXHtHJ
 Team Canada opened the World Junior Hockey Championship with an 8-0 win last night http://t.co/w0bg8idLZy http://t.co/1p4eswXHAy
 http://t.co/w0bg8idLZy
 http://www.cp24.com/sports/fabbri-petan-shine-canada-opens-world-juniors-with-8-0-win-1.2163272
 Fabbri, Petan shine, Canada opens world juniors with 8-0 win
 http://t.co/QDDgIFbQMz http://t.co/ss1HUyCw66
 http://t.co/QDDgIFbQMz
 http://www.cp24.com/sports/fabbri-petan-shine-canada-opens-world-juniors-with-8-0-win-1.2163272#ixzz3N492wfd8
 Fabbri, Petan shine as Canada opens world juniors with 8-0 win over Slovakia http://t.co/dJrq4cnXWT http://t.co/xku8FF4As6
 http://t.co/dJrq4cnXWT
 http://ow.ly/Gt1kM
 Petan with a beauty to put Canada up 7-0 against Slovakia. #WorldJuniors #GoCanadaGo
 https://t.co/LMMshAAMEh
 https://t.co/LMMshAAMEh
 https://vine.co/v/OHDxuJXHtHJ
 Another one for #TeamCanada scored by Nic Petan. #Canada now up 7-0 on Slovakia at #WJC2015 http://t.co/jgBhcB4C62
 Team Canada lines v Slovakia:

 Domi-Reinhart-Duclair
 Ritchie-McDavid-Lazar
 Paul-Petan-Fabbri
 Crouse-Gauthier-Virtanen
 Point (RW)
 All 30 teams have at least 1 player @ WJC. Winnipeg leads with 6: Comrie, Morrissey, Petan (CAN), Ehlers (DEN), De Leo (USA), Kostalek (CZE)
 #petan
 Canada opens world juniors with 8-0 win over Slovakia http://t.co/qXk5tsgsvP http://t.co/xc6MZzzFLZ
 http://t.co/qXk5tsgsvP
 http://ow.ly/Gt1Cq
 Canada wins 8-0

 Fabbri 2-2
 Petan 1-2
 Duclair 1-1
 Domi 1-1
 Point 1-1
 Virtanen 1-1
 Reinhart 0-2
 Paul 1-0
 Bowey 0-1
 Hicketts 0-1
 Crouse 0-1
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 http://t.co/vATmIndEAb
 http://xbx.lv/1t8ubaa
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 http://t.co/PEOIl5pjyU
 http://bit.ly/OneVsFour
 http://t.co/NWD88yZINF
 http://ow.ly/i/85qGX
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 http://t.co/XJ6rpHySm1
 http://arcadesushi.com/win-an-assassins-creed-unity-xbox-one-bundle/
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 http://t.co/GPXFtPzI7v
 http://cnn.it/16Wgr8c
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 http://t.co/lCcbDX9TQe
 http://l.gamespot.com/13C2iuO
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='Matt Cooke', url='http://twitter.com/search?q=%22Matt+Cooke%22', query='%22Matt+Cooke%22'}
 TrendJSONImpl{name='Slovakia', url='http://twitter.com/search?q=Slovakia', query='Slovakia'}
 20 hours after losing 8-0 to Canada, Slovakia upsets last year's gold medalist Finland 2-1 at the #2015WJC
 Slovakia's Erik Cernak suspended one game, tomorrow vs. USA, after check to the head and neck area of Rantanen. http://t.co/YZ1Uq8tvO4
 http://t.co/YZ1Uq8tvO4
 http://www.worldjunior2015.com/en/news/cernak-suspended/
 Bye Slovakia... http://t.co/gYUHaAQwtN
 Martin Reway and Team Slovakia pulled off a major upset in Montreal this afternoon. READ -> http://t.co/7MDLdZ9M6l http://t.co/zhQwpzicXV
 http://t.co/7MDLdZ9M6l
 http://goha.bs/16WfmNP
 #WorldJuniors today on @NHLNetwork:
 Fasching, Compher, USA vs. Slovakia, 4pm
 Reinhart, Canada vs. Finland, 8pm

 On MSG, #Sabres #Sens 7:30pm
 The @USAhockey team will be back in action in World Juniors today against Slovakia at 4 pm ET on @NHLNetwork
 Sivý Vrch, Slovakia http://t.co/VZa16hVYzV
 SVK 2, FIN 1: Denis Godla stops 37 for Slovakia in upset of 2014 champions Finland. http://t.co/5v8zlKyKm6 http://t.co/qqA8WNtxci
 http://t.co/5v8zlKyKm6
 http://thesco.re/1BfSamH
 Martin Reway picks up a couple of assists to lead Slovakia over Finland by a score of 2-1 in Montreal this afternoon. #WJC2015
 Robby Fabbri had two goals and two assists for Canada last night in his first game of the #WJC2015 vs. Slovakia. http://t.co/Viwq49P9rN
 great team perfromance and spectacual goaltending, so proud of this team ! #slovakia #big #win http://t.co/epSDQMeOiS
 Final: Slovakia 2, Finland 1. The defending champions have yet to win a game at #WJC2015. http://t.co/UnVR2NL7Tp
 Anybody else taking great pleasure in the fact that Slovakia is ahead of the USA in the #WorldJuniors standings?
 ON NOW: Slovakia leads Finland 2-1 heading into the 3rd period on #TSN. #HereWeGo http://t.co/YUoiJMEHsL
 #WJC2015 | #SVK 2 #FIN 1 @CanadiensMTL prospect @rewy77 with 2 assists to lead #Slovakia to the victory. http://t.co/WRpAiS7lQE
 LocationJSONImpl{woeid=3369, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Ottawa', url='http://where.yahooapis.com/v1/place/3369'}
 TrendJSONImpl{name='New Years', url='http://twitter.com/search?q=%22New+Years%22', query='%22New+Years%22'}
 This is me on New Years. http://t.co/VrbGCq36V1
 So do you all have your New Years resolutions ready??
 RT if you want us to make a "Like That" music video right after New Years!
 Who's kissing me on New Years
 Alcohol or my tears
 Me on new years  http://t.co/w0uZOkPYnT
 http://t.co/w0uZOkPYnT
 http://vine.co/v/OvId1m0jAuv
 New Years resolution 👌 http://t.co/S7ZT5u9Pdz
 New Years resolution: http://t.co/PxQVgnaawB
 #NashsChristmasSkit Hope you liked the video! I can't wait to show you my New Years Skit! Subscribe to my channel!!! http://t.co/2EpVlv09iY
 http://t.co/2EpVlv09iY
 http://youtu.be/_kH7XBWLUck
 New Years resolution: http://t.co/KcakWvl1MZ
 This is me on New Years. http://t.co/Hmia6N9Sd1
 Kinda want a New Years kiss kinda want 10 shots of tequila instead
 i've never had a new years kiss, or a mistletoe kiss but i did have a hershey's kiss and it was spectacular
 New Years resolution: http://t.co/TqtkPWzSnJ
 New Years resolution 🙏🙌 http://t.co/uXK5jqllpC
 New Years Resloution: http://t.co/HTOFWHRU6S
 TrendJSONImpl{name='Ottawa', url='http://twitter.com/search?q=Ottawa', query='Ottawa'}
 "If you don't find your roommate weird, you're probably the weird roommate" -  U Ottawa
 Según la universidad de Ottawa, la mujer ha evolucionado para ser mala con otras mujeres.
 Our guys timed Nyqvist as having the puck for 28 seconds before he scored the winning goal vs Ottawa. Hell of a shift.
 Nyquist's overtime heroics lift Detroit in Ottawa!

 DRWBlog: http://t.co/woVwRrF2dS http://t.co/Ij3ibatlEi
 http://t.co/woVwRrF2dS
 http://redwings.nhl.com/club/m_blogsindex.htm?id=404
 Just arrived in Ottawa! Food coma. Now sleep for 10 hours. Tomorrow I play EY centre with @DVBBS & @OliverHeldens :)
 The risks of remembering the Ottawa shooting http://t.co/fB7LLNDXMU Part of Bearing Witness, 2014's news told by people who were there
 http://t.co/fB7LLNDXMU
 http://trib.al/3b2UNPQ
 In Ottawa for one day! Working on #LesCoeursQuiCraquent in the car :)
 Iconic royal guards pulled from outside Buckingham Palace over fears of Ottawa-style attacks http://t.co/VjQOG2tLTB http://t.co/npuJ06AHah
 http://t.co/VjQOG2tLTB
 http://natpo.st/1BfiqO9
 FIRST LOOK: Stephen Weiss takes the ice for warm ups in Ottawa. #ATTExtCoverage http://t.co/gnHH9uwlAM
 Six bystanders ran to help Cpl. Nathan Cirillo. They were strangers then. They are not now. http://t.co/5MeJ8Xmei9 http://t.co/8uWKHZbXyU
 http://t.co/5MeJ8Xmei9
 http://ow.ly/Gvkoa
 My brother is with me on tour, we're on our way to Ottawa! Will be an epic night with the bro's @DVBBS and @tyDi :) http://t.co/XSlrHvIc23
 The #RedWings have hit the ice for warm-ups here in Ottawa. #GoWings https://t.co/ysh2rYqQnh
 https://t.co/ysh2rYqQnh
 https://vine.co/v/OH2i7QKMLqZ
 Amazing. Red Wings Nyquist controlled the puck in Ottawa end a full 30 seconds on his own before scoring in OT.
 TrendJSONImpl{name='#CamAndNash', url='http://twitter.com/search?q=%23CamAndNash', query='%23CamAndNash'}
 Tweet me pictures of me and Nash #CamAndNash (:
 Here's a #CamAndNash photo I never posted from this summer http://t.co/L0tbHa0AEr
 THIS WAS A YEAR AGO TODAY WHAT #CamAndNash http://t.co/YApNX8i9Yr
 Friendship Goals #CamAndNash http://t.co/iKvb11UWfD
 Because you stayed together even in the most difficult moments. That's why you're my favorite duo❤ #CamAndNash http://t.co/hGmGZZCju5
 A LOT OF THINGS HAVE CHANGED IN THE PAST YEAR BUT ONE THING THAT DIDNT CHANGE & NEVER WILL IS #CamAndNash FRIENDSHIP http://t.co/yotlFaXQZh
 #CamAndNash BASICALLY BROTHERS http://t.co/ZuYpzg776J
 It's crazy what one year can do
 #CamAndNash http://t.co/cel9NxYuGG
 Friend goals #CamAndNash http://t.co/TyyJEzaHtm
 "I would have never wanted to experience this with anyone else"this is why you're my favorite friendship😢 #CamAndNash http://t.co/L0IBkiI4D7
 FORÇAS EU PRECISO DE FORÇAS #CamAndNash http://t.co/Hb0KhHeZ7X
 NASH AND CAM ARE BROTHERS FROM DIFFERENT MOTHERS. THEIR FRIENDSHIP SLAYS EVERYTHING #CamAndNash  https://t.co/RFqwROR5Ja
 https://t.co/RFqwROR5Ja
 https://vine.co/v/OHjUxgbthjL
 They're both dorks but that's what makes them bestfriends #CamAndNash http://t.co/hI2i1DLSKn
 RT IF YOU ALWAYS ARE HERE FOR SUPPORT THEM ASF #CamAndNash Cash ♥☺ http://t.co/bje9rSqwNG
 #HappyBirthdayNash #CamAndNash @camerondallas @NashgrierI literally love Cam and Nash’s friendship. http://t.co/ctsTedIhtp
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 http://t.co/vATmIndEAb
 http://xbx.lv/1t8ubaa
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 http://t.co/PEOIl5pjyU
 http://bit.ly/OneVsFour
 http://t.co/NWD88yZINF
 http://ow.ly/i/85qGX
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 http://t.co/XJ6rpHySm1
 http://arcadesushi.com/win-an-assassins-creed-unity-xbox-one-bundle/
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 http://t.co/GPXFtPzI7v
 http://cnn.it/16Wgr8c
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 http://t.co/lCcbDX9TQe
 http://l.gamespot.com/13C2iuO
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='The Wire', url='http://twitter.com/search?q=%22The+Wire%22', query='%22The+Wire%22'}
 Wire Trivia: NYPD called to complain drug crews in NY were mimicking The Wire and started using "burners" #TheWireMarathon
 The Wire is pure, unadulterated American cultural genius. Seeing the marathon in HD after all these years only reaffirms it. Best Drama Ever
 In about 90 minutes, there will be simultaneous TV marathons of The Wire and Breaking Bad. What a great and glorious time we live in.
 Between talking about Boogie Nights and The Wire you can go on a successful first date with any guy in LA
 This is what The Wire looks like in HD http://t.co/57Uv3nSemI http://t.co/Dcd1hd1UX8
 http://t.co/57Uv3nSemI
 http://theverge.com/e/7221332
 Season 4 of The Wire is the best season of television in the history of television. I really mean that.
 Also, I judge people based on whether or not they liked Season 2 of The Wire.
 HBO Signature should just rotate The Wire marathons and The Sopranos marathons. That should be the entire channel. Sheeeeeeeeeeee-et.
 The Rockets have won the last 6 consecutive vs San Antonio, including a 5-0 series sweep last season & a wire-to-wire victory on 11/6 in HOU
 See before and after photos of locations from 'The Wire' http://t.co/QDEfDzEHvv http://t.co/bl1Vq7Aen2
 http://t.co/QDEfDzEHvv
 http://nym.ag/1y0bmr3
 Wire trivia: I never knew Butch was REALLY blind until the day we shot the scene where I picked up the gun #TheWireMarathon
 Why are professors at Harvard, Duke, and Middlebury teaching courses on The Wire? http://t.co/aYO5uhAs3Z http://t.co/9MjUWN71MF
 http://t.co/aYO5uhAs3Z
 http://slate.me/1xZ4OZy
 It's coming down to the wire in South Beach! @MiamiHEAT trail @MemGrizz by 4 with 1:30 remaining on NBA TV.
 TrendJSONImpl{name='Toronto', url='http://twitter.com/search?q=Toronto', query='Toronto'}
 Lou Williams is a serious candidate for 6th man of the year. He's been great for Toronto. Lou has 21 points in 22 minutes tonight.
 Travelers will soon walk under a lake to catch flights in Toronto http://t.co/QuOiYSt4Wk
 http://t.co/QuOiYSt4Wk
 http://wrd.cm/1zrhlAy
 TICKET UPDATE: Only 30 Silver Meet&Greet VIP's left in TORONTO for #DigiFestToronto --> http://t.co/njltpL5HAR RT!! http://t.co/BdIqyf5ph2
 http://t.co/njltpL5HAR
 http://DigiFestToronto.com
 Kyle Lowry is LEADER OF MEN. 30 pts, 11 ast & 7 rebs vs Denver. Best player in Toronto, period. #NBABallot http://t.co/9ObvCD3R0t
 Toronto you make me feel like home 🙌
 #Toronto, Canada. http://t.co/b5SuaryJ4F
 Toronto, Trinidad, LSD trips, haunting paintings. Excellent. http://t.co/f8If1isI2x #PeterDoig http://t.co/9Ji7EfDObS
 http://t.co/f8If1isI2x
 http://www.wsj.com/articles/peter-doigs-haunted-lakes-and-tropics-on-view-in-basel-1419615204
 Porter Airlines Flight PD539 makes emergency landing in Toronto http://t.co/cNJzPTxi0v http://t.co/iIFDYNtaZN
 http://t.co/cNJzPTxi0v
 http://www.cbc.ca/news/canada/toronto/porter-airlines-flight-pd539-makes-emergency-landing-in-toronto-1.2885113?cmp=rss
 URGENTE | Vuelo #PD539 aterrizó en Toronto. Motor derecho explotó, hay un pasajero herido.
 I'm so impressed by Toronto. They're 23-7, and 10-4 since DeMar DeRozan got hurt. How many teams could do that without their leading scorer?
 Plane from Toronto to DC makes emergency landing in Pennsylvania; smoke detected in cabin: http://t.co/zh2YYo4Unh
 http://t.co/zh2YYo4Unh
 http://yhoo.it/1A2ZClM
 Clips have to play Hedo and Big Baby in the last 8 mins of this Toronto game. I might have to invite GM Doc to the Atrocious GM Summit.
 Toronto police are investigating a stabbing near Queens Quay and Lower Jarvis near the Guvernment nightclub.
 I'm in Toronto <3 http://t.co/orjse1DCwz
 Enjoying some quality with my dear friend tomrobertson in Toronto. _sy.

 #samiyusuf #tomrobertson… http://t.co/KSdlfXxYXM
 http://t.co/KSdlfXxYXM
 http://instagram.com/p/xLCOHnOTxw/
 TrendJSONImpl{name='Taylor', url='http://twitter.com/search?q=Taylor', query='Taylor'}
 “Taylor Swift owned 2014 in a manner not seen since perhaps Britney Spears in the early 2000s.” http://t.co/fahrUjwRYu
 http://t.co/fahrUjwRYu
 http://vnty.fr/1Ev42XR
 i have so much respect for taylor swift though http://t.co/ffbMEV4Dtj
 Elizabeth Taylor http://t.co/MXZm3gFQ1t
 This is why I respect Taylor so much. http://t.co/5wpvh3KePo
 Elizabeth Taylor, Liza Minelli, Michael Jackson, and Whitney Houston http://t.co/bgYa79Y6uB
 this is so disgusting why is taylor caniff still alive https://t.co/CTpqNtOkwm
 https://t.co/CTpqNtOkwm
 https://vine.co/v/OXbthaJQ5QV
 This is why I love Taylor Swift http://t.co/lYHHxfXsyx
 Confession: our New Year's resolution is to dress like Taylor Swift: http://t.co/WcqrivIE0n http://t.co/6W89RU2YPu
 http://t.co/WcqrivIE0n
 http://eonli.ne/1xaWJzx
 Taylor from Monmouth University http://t.co/TqmJ4ebAJ4
 First game results -
 Me - 104 😏😏😏😏
 Taylor - 101
 Connor - 100
 Dad - 94
 #EASYY
 TAYLOR SWIFT GETS IT http://t.co/ULzUlaxTg6
 I was a Giants’ beat guy in 1986, Lawrence Taylor’s MVP year. I think this season by Watt is better.
 Results from game 2 -
 Me - 111 😏😏
 Taylor - 105
 Connor - 61
 Dad - 55

 Proof that me and Taylor are the best 😏
 Great effort from Connor
 TrendJSONImpl{name='Sens', url='http://twitter.com/search?q=Sens', query='Sens'}
 Les excuses perdent tout leur sens quand elles doivent être dites plus d’une fois.
 Je sens que pendant les 7 jours à venir toutes mes mentions Twitter seront des SqueezieMemes :') #AppliSqueezie
 L'effort ça marche dans les deux sens, pas dans un seul.
 Enfin une journée internationale qui a du sens. http://t.co/n9ZpwNa8Rc
 "La styliste que j'avais à ce moment ne savait pas dans quel sens se portait la robe. En fait, je l'ai portée à +" http://t.co/ly9OosjfS8
 rt si t'es cool et tu te sens pas supérieur
 Perso J'me sens plus représenté par une chaise de jardin que par Hassen Chalghoumi
 sens:  gimme
 nyquist:  nope
 sens:  please
 nyquist:  nope
 sens:  c'mon
 nyquist:  nope
 sens:  dude
 nyquist: *snipe*
 sens:  man
 nyquist:  lol
 J'ai envie de retrouver ma famille, là où j'me sens chez moi: avec vous et avec eux♡

 #FrenchiesWantOTRAT http://t.co/vPKLrHX7rO
 j'ai trop hâte de voir les lives de act my age mdrrrr le live de cette chanson ça va être de la pure folie, ça va partir dans tous les sens
 Même si j'ai peur de l'amour, ta vie donne un sens à mes jours.
 Oublier le sens d'un mot. > Se tapper le crane sur le sol. > Saigner. > Mourrir.
 Gustav Nyquist scores video game goal to lift Wings over Sens http://t.co/vTmM7etqwd
 http://t.co/vTmM7etqwd
 http://www.thehockeynews.com/blog/gustav-nyquist-scores-video-game-goal-to-lift-wings-over-sens/
 On se demande parfois si la vie a un sens, puis on rencontre des personnes qui donnent un sens à notre vie.
 J’adore quand je te sens sourire lorsque l’on s’embrasse.
 TrendJSONImpl{name='#CalmDownABand', url='http://twitter.com/search?q=%23CalmDownABand', query='%23CalmDownABand'}
 A normal length of Summer #CalmDownABand
 Mild concern at the disco #CalmDownABand
 Several Directions #CalmDownABand
 involuntary eye movement 182 #CalmDownABand
 #CalmDownABand juan direction #GlobalArtistHMA one direction http://t.co/zpacL5OQQE
 #CalmDownABand my chemical lets just be friends
 #CalmDownABand You Me At 3pm bc 6 is too late
 Cubtooth #CalmDownABand
 #CalmDownABand I Came Out To Have A Good Time And Honestly I'm Feeling So Attacked Right Now! At The Disco
 The Motionless Stones #CalmDownABand
 #CalmDownABand A few general Directions
 Tepid Monkeys #CalmDownABand
 Mild Anxiety At The Disco  #calmdownaband
 #CalmDownABand uncontrollable eyelid movement 182
 #CalmDownABand Nuns N' Moses
 TrendJSONImpl{name='#reasonsniallleftonedirection', url='http://twitter.com/search?q=%23reasonsniallleftonedirection', query='%23reasonsniallleftonedirection'}
 #reasonsniallleftonedirection he wanted to be closer with his sisters http://t.co/ZyhDkfaMlG
 Niall has left 1D to pursue a solo career! Check out the tracklist to his new album

 #reasonsniallleftonedirection http://t.co/TxXaUNF8uv
 But seriously Niall is too 1D af to leave the band

 #reasonsniallleftonedirection http://t.co/6BgNKUz4UD
 Just to confirm, Niall is NOT leaving One Direction. We were hacked, innit. #reasonsniallleftonedirection http://t.co/YRVfSYe5x7
 http://t.co/YRVfSYe5x7
 http://twitter.com/sugarscape/status/549545533220864000/photo/1
 He was sick of the boys not telling him what they were going to wear #reasonsniallleftonedirection http://t.co/9pKU8IYaNK
 Because he was tired of fans not knowing their basic facts #reasonsniallleftonedirection -A http://t.co/B9IaSZbOFW
 He was tired of Louis always getting them stopped by the police

 #reasonsniallleftonedirection http://t.co/3nT29tOilx
 #reasonsniallleftonedirection

 how is this even possible niall IS the biggest fan of one direction hes 1d af http://t.co/PJN8FgQwZt
 "niall didn't actually leave the band"

 "calm down it's just a joke"
 #reasonsniallleftonedirection
 http://t.co/uwSQvjc5rA
 http://t.co/uwSQvjc5rA
 http://twitter.com/eighteeniaIl/status/546754863078858752/photo/1
 He was still upset that X Factor spelt his name wrong

 #reasonsniallleftonedirection http://t.co/UekW3kAW4i
 #reasonsniallleftonedirection because they wrote a song about being fireproof but niall is not fireproof http://t.co/e1gyNRkuz6
 http://t.co/e1gyNRkuz6
 http://twitter.com/highonlirry/status/549413275000381441/photo/1
 he decided to become a professional photographer for one direction

 #reasonsniallleftonedirection http://t.co/4VOEcrR5Gg
 #reasonsniallleftonedirection

 He couldn't take the tension of sitting between Louis and Harry anymore.. http://t.co/yOotH0E40n
 #reasonsniallleftonedirection the interviewer didnt let him take the group selfie http://t.co/K1bbkCHIuU
 #reasonsniallleftonedirection

 Because he wanted to pursue his carrer as volunteer fan for 5sos http://t.co/cY0tP24rAQ
 LocationJSONImpl{woeid=3444, countryName='Canada', countryCode='CA', placeName='Town', placeCode='7', name='Quebec', url='http://where.yahooapis.com/v1/place/3444'}
 TrendJSONImpl{name='Québec', url='http://twitter.com/search?q=Qu%C3%A9bec', query='Qu%C3%A9bec'}
 #reasonsniallleftonedirection he realized he wasn't fireproof http://t.co/OeYwaCMiE7
 Collège de Valleyfield, Quebec http://t.co/hbx53vT5nh
 the "let's not tell niall" game was too strong he couldn't handle it anymore

 #reasonsniallleftonedirection http://t.co/vXBofC2F59
 (IT) Quebec City e il fiume St. Lawrence vestiti per l'inverno! Il centro storico è patrimonio  mondiale #UNESCO. http://t.co/64cvCUf6o0
 #reasonsniallleftonedirection because he got his own talkshow http://t.co/YRCRyq7bPY
 #reasonsniallleftonedirection

 Because he constantly left out http://t.co/SoiYw8beH1
 #reasonsniallleftonedirection
 to move in with his sisters http://t.co/SYcm0BfMiO
 Can we get a piece of Quebec ?
 ''The boys won more than 55 awards in 2014 only''

 Fandom:
 #ArtistOfTheYearHMA One Direction http://t.co/kQTMcQyj6o
 He is the biggest fan who met them 78324873247437 and more times

 #reasonsniallleftonedirection http://t.co/Mm6Zfkoyum
 ''He followed you''
 ''You have 5/5''
 ''You met them''

 #ThreeWordsSheWantsToHear
 He was tired of people spelling his name wrong

 #reasonsniallleftonedirection http://t.co/6BkCfx9kte
 My Internet best friend when she will meet me http://t.co/eV05DnZ9tc
 This just in, @Fucale31 will start for Canada against Finland. @HC_WJC #WJC2015 @CanadiensMTL @quebec_remparts http://t.co/DhindzLWUj
 REMEMBER WHEN HARRY TWERKED

 #ArtistOfTheYearHMA One Direction

 https://t.co/2rJhBvs4Zq
 https://t.co/2rJhBvs4Zq
 https://vine.co/v/OvXHOuz22b3
 TrendJSONImpl{name='Noël', url='http://twitter.com/search?q=No%C3%ABl', query='No%C3%ABl'}
 Noel Baba: Kendi çocuklarına gökten oyuncak, Müslüman çocukları üzerine misket bombaları atan kültürün temsilcisidir. http://t.co/aOfrF5cvhM
 Le plus grand cadeau de Noël du monde fut la Statue de la Liberté. Les français l'ont offert aux États-Unis en 1886.
 Adam gelmiş 2015'den ne bekliyorsun diyor.
 Kardeşim yeni yılın amk.
 2014 neydi ki 2015 de ne olsun.
 Noel babayıda geyikler siksin.
 "Seneye görüşürüz" " 7 hristiyan danaya girmedikçe ben noel kutlamam" █████████████___________| %45 Loading...
 Çok Sevgili Noel Baba;
 Bırak artık şu ışıklı, müzikli, janjanlı hediyeleri.
 Kim kimi seviyorsa,
 Yeni yılda götürüp bırakıver kapısına.
 Bazı insanlardan dürüstlük/samimiyet beklemek..........
 Noel babadan hediye beklemek gibi.......(!)
 Je vous prépare une petite surprise pour ce soir ! Des mois que j'attends ça, c'est mon cadeau de Noël pour vous :d
 Biri noel baba'ya afrika'nin yolunu göstersin madem bu kadar yardımsever. http://t.co/29ggKb5pMn
 MON CADEAU DE NOËL POUR VOUS ! http://t.co/cFLbzcOyR9 #RT si t'aimes bien les cadeaux
 http://t.co/cFLbzcOyR9
 http://youtu.be/M0K9Akpt0Gg
 Moi après noël http://t.co/biJ3QjV4pO
 Kar yağmayan yılbaşı olmaz olsun. Küresel ısınmanın da Allah belasını versin. Noel baba da artık bıraksın bu işleri gitsin ayakkabı boyasın.
 Ben anlamam Noel Baba'dan. Biz iki tane baba biliriz; Baba Hakkı ve Müslüm Baba.
 - Que te trajo papá noel?

 - Kilos.
 Bakın bu Noel Baba ne dedi? Hediye dağıtacakmış. Ya sen benim kardeşlerimin evine nasıl bacadan girersin??
 Erkek adam için noel baba yoktur müslüm baba vardır.
 TrendJSONImpl{name='Slovaquie', url='http://twitter.com/search?q=Slovaquie', query='Slovaquie'}
 Le Canada bat la Slovaquie 8-0 et, par le fait même, Fucale obtient son premier blanchissage au Centre Bell. #CMJ2015 http://t.co/OGlazFmNan
 C'est parti pour le match Canada-Slovaquie! #CMJ2015 / Canada-Slovakia is underway here at the Bell Centre! #WJC2015 http://t.co/l71JCGexj3
 Échauffement en cours pour le match Canada-Slovaquie #CMJ2015 / Warmup underway for the Canada-Slovakia game #WJC2015 http://t.co/SL8eif1Gyc
 Trois espoirs du CH sont capitaines de leurs clubs au Championnat junior: De La Rose (Suède), Lehkonen (Finlande) et Reway (Slovaquie).
 Un résumé de la victoire de 8 à 0 du Canada face à la Slovaquie au #CMJ2015. -> http://t.co/PZT0tC5nPY http://t.co/NnVDfAqXyO
 http://t.co/PZT0tC5nPY
 http://goha.bs/1vyyzL4
 Martin Reway est le joueur du match pour la Slovaquie. #CMJ2015 / Martin Reway is named the Player of the Game for Slovakia. #WJC2015
 Le Canada mène 7 à 0 contre la Slovaquie après 40 minutes. Fucale toujours parfait avec 8 arrêts jusqu'ici. #CMJ2015
 Après 20 minutes, le Canada mène 3 à 0 face à la Slovaquie. Fucale n'a pas été bien occupé, mais est parfait avec 3 arrêts. #CMJ2015
 TrendJSONImpl{name='Montreal', url='http://twitter.com/search?q=Montreal', query='Montreal'}
 RT If you think I should YOLO book a flight up to Montreal to see #ThePack for my million subscriber milestone.
 Jordan Staal will play in tomorrow's game against Montreal.
 On my way to Vegas, Miami & Montreal! #LETSGO
 O'Reilly being offered around the league for a good D-man. Florida and Winnipeg. Pondering, Toronto and Montreal too
 Montreal-area photographer slapped with a $1,000 fine for flying a drone http://t.co/Wmx1RlCoGW
 http://t.co/Wmx1RlCoGW
 http://ow.ly/Gw6CM
 Wheels up! Next stop Montreal! ✈️
 Perempuan memiliki kecenderungan menjadi lebih stres setelah melihat berita negatif, ketimbang pria. [Peneliti di Montreal, Kanada]
 La police de Montréal demande l'aide de la population afin de retrouver Amine El Alaoui. http://t.co/TxhmtsBA0o http://t.co/R5YcZjYkxm
 http://t.co/TxhmtsBA0o
 http://bit.ly/16XyYRQ
 Canada posts second straight shutout in 4-0 win over Germany #WJC http://t.co/dOH0IwGf4i http://t.co/P3an9SYMSL
 http://t.co/dOH0IwGf4i
 http://trib.al/ALqGUBr
 Landed in Montreal! ✈️ 🍁 😀
 Autumn in #Montreal. http://t.co/cbYIN7xsww
 Many Canadians will instinctively bash Toronto & Montreal for attendance at WJHC. Villain is Hockey Canada greed. Tickets way overpriced.
 “@onlysamsam: @omgAdamSaleh are you planning on coming to Montreal, Canada?? #AskAdamSaleh” yes!! Need to do a proper show there :)
 Charles de Gaulle discutant avec le maire de Montréal Sarto Fournier, avril 1960 #histoire #Montréal http://t.co/NEt1Nn4ttw
 Two Montreal police officers on Christmas Eve graveyard shift help deliver baby in back of car http://t.co/c1aMJxZy5U http://t.co/luPKEu6gwc
 http://t.co/c1aMJxZy5U
 http://on.thestar.com/1rrG7Ta
 TrendJSONImpl{name='Quebec', url='http://twitter.com/search?q=Quebec', query='Quebec'}
 #reasonsniallleftonedirection he realized he wasn't fireproof http://t.co/OeYwaCMiE7
 Collège de Valleyfield, Quebec http://t.co/hbx53vT5nh
 the "let's not tell niall" game was too strong he couldn't handle it anymore

 #reasonsniallleftonedirection http://t.co/vXBofC2F59
 (IT) Quebec City e il fiume St. Lawrence vestiti per l'inverno! Il centro storico è patrimonio  mondiale #UNESCO. http://t.co/64cvCUf6o0
 #reasonsniallleftonedirection because he got his own talkshow http://t.co/YRCRyq7bPY
 #reasonsniallleftonedirection

 Because he constantly left out http://t.co/SoiYw8beH1
 #reasonsniallleftonedirection
 to move in with his sisters http://t.co/SYcm0BfMiO
 Can we get a piece of Quebec ?
 ''The boys won more than 55 awards in 2014 only''

 Fandom:
 #ArtistOfTheYearHMA One Direction http://t.co/kQTMcQyj6o
 He is the biggest fan who met them 78324873247437 and more times

 #reasonsniallleftonedirection http://t.co/Mm6Zfkoyum
 ''He followed you''
 ''You have 5/5''
 ''You met them''

 #ThreeWordsSheWantsToHear
 He was tired of people spelling his name wrong

 #reasonsniallleftonedirection http://t.co/6BkCfx9kte
 My Internet best friend when she will meet me http://t.co/eV05DnZ9tc
 This just in, @Fucale31 will start for Canada against Finland. @HC_WJC #WJC2015 @CanadiensMTL @quebec_remparts http://t.co/DhindzLWUj
 REMEMBER WHEN HARRY TWERKED

 #ArtistOfTheYearHMA One Direction

 https://t.co/2rJhBvs4Zq
 https://t.co/2rJhBvs4Zq
 https://vine.co/v/OvXHOuz22b3
 TrendJSONImpl{name='#BoxingDay', url='http://twitter.com/search?q=%23BoxingDay', query='%23BoxingDay'}
 voila pourquoi #BoxingDay http://t.co/GIigjVf8zC
 http://t.co/GIigjVf8zC
 http://twitter.com/saintmtex/status/549235813171867648/photo/1
 California USA Huntington Beach → http://t.co/ECnt04G1rn #BoxingDay 773 Boxing Day sales: I saw a mother use a pushchair as a battering ram…
 http://t.co/ECnt04G1rn
 http://buff.ly/1xlX9lk
 → http://t.co/ECnt04G1rn 165 Boxing Day  Boxing Day sales: I saw a mother use a pushchair as a battering ram #BoxingDay Tennessee USA Chatt…
 http://t.co/ECnt04G1rn
 http://buff.ly/1xlX9lk
 North Carolina USA Greensboro → http://t.co/kQ3QgjiPgr #BoxingDay 516 Boxing Day bargains attract huge crowds Boxing Day
 http://t.co/kQ3QgjiPgr
 http://buff.ly/1rqT93B
 → http://t.co/Y7FBnbC5cW Boxing Day Takes A Beating At Black Fridays Hands, But Still A Contender #BoxingDay 897 http://t.co/hao1AYiGSG
 http://t.co/Y7FBnbC5cW
 http://buff.ly/1AWXLA9
 → http://t.co/X45iN60r8V 355 WA shoppers splurge $250 million #BoxingDay Shoppers queue outside Selfrdiges ahead of … http://t.co/giZKjDF2DM
 http://t.co/X45iN60r8V
 http://buff.ly/1trVGvB
 » NEWS » http://t.co/kQ3QgjiPgr 915 Boxing Day  Boxing Day bargains attract huge crowds #BoxingDay Missouri USA Springfield
 http://t.co/kQ3QgjiPgr
 http://buff.ly/1rqT93B
 » http://t.co/ECnt04G1rn 935 #BoxingDay Boxing Day Boxing Day sales: I saw a mother use a pushchair as a battering r… http://t.co/ALoLEBoT05
 http://t.co/ECnt04G1rn
 http://buff.ly/1xlX9lk
 Blowing for home - the Holcombe Hunt had a few people out on #BoxingDay. Thanks to Nicky for this excellent photo. http://t.co/2f4aWL71BB
 [#BoxingDay] John Terry célébrant son but devant les fans de West Ham ! http://t.co/yCuJ92jC6Q
 Queensland AUS Gold Coast » http://t.co/XODGnzX4bi #BoxingDay 10 Boxing Day sales shoppers clock up 5.7 million transactions with one bank …
 http://t.co/XODGnzX4bi
 http://buff.ly/1zLACSn
 California USA Vallejo → http://t.co/ECnt04G1rn #BoxingDay 517 Boxing Day sales: I saw a mother use a pushchair as a battering ram Boxing D…
 http://t.co/ECnt04G1rn
 http://buff.ly/1xlX9lk
 California USA Glendale → http://t.co/Y7FBnbC5cW #BoxingDay 754 Boxing Day Takes A Beating At Black Fridays Hands, But Still A Contender Bo…
 http://t.co/Y7FBnbC5cW
 http://buff.ly/1AWXLA9
 → http://t.co/ECnt04G1rn 19 Boxing Day  Boxing Day sales: I saw a mother use a pushchair as a battering ram #BoxingDay California USA Coron…
 http://t.co/ECnt04G1rn
 http://buff.ly/1xlX9lk
 TrendJSONImpl{name='Xbox', url='http://twitter.com/search?q=Xbox', query='Xbox'}
 Only 24 hours to the #Halo 5: Guardians Multiplayer Beta.
 RT if you'll be playing. http://t.co/vATmIndEAb http://t.co/LIn3AZDbr8
 http://t.co/vATmIndEAb
 http://xbx.lv/1t8ubaa
 She swallowed an Xbox controller 😂😂😩😩💀💀 http://t.co/4bix0YVJHR
 .@Xbox One Outsells @Playstation 4 For The First Time This Year (STORY) http://t.co/PEOIl5pjyU http://t.co/NWD88yZINF
 http://t.co/PEOIl5pjyU
 http://bit.ly/OneVsFour
 http://t.co/NWD88yZINF
 http://ow.ly/i/85qGX
 Hey US and Canada - The Interview is now available on Digital HD on: Google Play, YouTube Movies, XBOX, and... iTunes!!!!!!!!!!
 If you like PlayStation, Wii or Xbox

 ...thank Gerald Lawson...he created the single cartridge-based gaming system. http://t.co/WQlDYREjqv
 Retweet for ps4.... Or favourite for Xbox 1 ???? Big decision
 Follow @XXL & @ArcadeSushi and RT this for your chance to win an @assassinscreed Unity XBOX ONE bundle: http://t.co/XJ6rpHySm1
 http://t.co/XJ6rpHySm1
 http://arcadesushi.com/win-an-assassins-creed-unity-xbox-one-bundle/
 PlayStation and Xbox still struggling after alleged cyberattack on Christmas Day. http://t.co/GPXFtPzI7v
 http://t.co/GPXFtPzI7v
 http://cnn.it/16Wgr8c
 Lizard Squad, Finest Squad, Anonymous and myself did a peace summit via @KEEMSTARx. The Agreement: No more attacks against Xbox & PSN.
 RT pour tenter de gagner 100.000 crédits sur XBOX ! (5 gagnants)
 Tirage Mercredi
 500 RTs and we'll fix the GTA servers for PSN & XBOX ONE! ~Kyna
 RT for Xbox

 Fav For PSN
 . @Soymarioruiz me hablo para decirme que le llevará su Xbox a Colombia, menos mal hoy es el día de lo inocentes.
 Xbox Exec teases gaming news for January Windows 10 event. http://t.co/lCcbDX9TQe http://t.co/vJhRmrcBcY
 http://t.co/lCcbDX9TQe
 http://l.gamespot.com/13C2iuO
 Dual Xbox One Giveaway!

 1) Follow me @FollowTrainsG @Pointed @akaLanes
 2) RT This
 3) Turn notifications on
 2 winners http://t.co/b4laRAQTby
 TrendJSONImpl{name='Christmas', url='http://twitter.com/search?q=Christmas', query='Christmas'}
 multiply is now 6x platinum in the uk, which has matched my first album, which i didn't think i could do. god bless christmas
 Check out this weeks new Christmas themed skit- http://t.co/2EpVlv09iY ! & make sure to subscribe to my channel for weekly videos!
 http://t.co/2EpVlv09iY
 http://youtu.be/_kH7XBWLUck
 Glad you guys are enjoying the christmas album! Was fun to make
 https://t.co/i9f15sSevr
 https://t.co/i9f15sSevr
 https://itunes.apple.com/gb/album/meet-vamps-christmas-edition/id925655725
 i like it when words sound like their meaning. like how the word "Christmas" sounds all sparkly like Christmas. and "worm" sounds all slimy
 "what did you get for christmas?"

 fat
 Person: what did u get for christmas

 Me: fat
 เวลาฝรั่งพูดว่า you look like a christmas  tree เนี้ยเค้าไม่ใด้ชมว่าแต่งตัวได้สวยงามเหมือนต้นคริสมัสนะ เค้าจิกว่าแต่งตัวมากเกินไป
 Outdoor Christmas Decorations  Giant 6'9' Popcorn by JabberDuck http://t.co/74epiKmgqN http://t.co/LP4iOAX0dj
 http://t.co/74epiKmgqN
 http://etsy.me/1yUZjru
 Outdoor/ CHRISTMAS DECORATIONS CANDY Decorations Hand by JabberDuck http://t.co/r8mv6Oo1Tu http://t.co/TmvHEBrMPz
 http://t.co/r8mv6Oo1Tu
 http://etsy.me/1plt58V
 CHRISTMAS DECORATIONS Outdoor CANDY Decorations Hand by JabberDuck http://t.co/obiJEEv6in http://t.co/w7zAllzIxQ
 http://t.co/obiJEEv6in
 http://etsy.me/1uT1Kf6
 Niall Horan visits Children's Hospital in Dublin whilst at home over Christmas break http://t.co/a0LqCmBCkY http://t.co/b4xxZNEidl
 http://t.co/a0LqCmBCkY
 http://on.sugarsca.pe/1zpDAXr
 my armpits smell like diner pickles. its time to wash this Christmas off
 there are 363 days till Christmas and people already have their Christmas lights up

 unbelievable
 TrendJSONImpl{name='#CalmDownABand', url='http://twitter.com/search?q=%23CalmDownABand', query='%23CalmDownABand'}
 A normal length of Summer #CalmDownABand
 Mild concern at the disco #CalmDownABand
 Several Directions #CalmDownABand
 involuntary eye movement 182 #CalmDownABand
 #CalmDownABand juan direction #GlobalArtistHMA one direction http://t.co/zpacL5OQQE
 #CalmDownABand my chemical lets just be friends
 #CalmDownABand You Me At 3pm bc 6 is too late
 Cubtooth #CalmDownABand
 #CalmDownABand I Came Out To Have A Good Time And Honestly I'm Feeling So Attacked Right Now! At The Disco
 The Motionless Stones #CalmDownABand
 #CalmDownABand A few general Directions
 Tepid Monkeys #CalmDownABand
 Mild Anxiety At The Disco  #calmdownaband
 #CalmDownABand uncontrollable eyelid movement 182
 #CalmDownABand Nuns N' Moses
 TrendJSONImpl{name='#reasonsniallleftonedirection', url='http://twitter.com/search?q=%23reasonsniallleftonedirection', query='%23reasonsniallleftonedirection'}
 #reasonsniallleftonedirection he wanted to be closer with his sisters http://t.co/ZyhDkfaMlG
 Niall has left 1D to pursue a solo career! Check out the tracklist to his new album

 #reasonsniallleftonedirection http://t.co/TxXaUNF8uv
 But seriously Niall is too 1D af to leave the band

 #reasonsniallleftonedirection http://t.co/6BgNKUz4UD
 Just to confirm, Niall is NOT leaving One Direction. We were hacked, innit. #reasonsniallleftonedirection http://t.co/YRVfSYe5x7
 http://t.co/YRVfSYe5x7
 http://twitter.com/sugarscape/status/549545533220864000/photo/1
 He was sick of the boys not telling him what they were going to wear #reasonsniallleftonedirection http://t.co/9pKU8IYaNK
 Because he was tired of fans not knowing their basic facts #reasonsniallleftonedirection -A http://t.co/B9IaSZbOFW
 He was tired of Louis always getting them stopped by the police

 #reasonsniallleftonedirection http://t.co/3nT29tOilx
 #reasonsniallleftonedirection

 how is this even possible niall IS the biggest fan of one direction hes 1d af http://t.co/PJN8FgQwZt
 "niall didn't actually leave the band"

 "calm down it's just a joke"
 #reasonsniallleftonedirection
 http://t.co/uwSQvjc5rA
 http://t.co/uwSQvjc5rA
 http://twitter.com/eighteeniaIl/status/546754863078858752/photo/1
 He was still upset that X Factor spelt his name wrong

 #reasonsniallleftonedirection http://t.co/UekW3kAW4i
 #reasonsniallleftonedirection because they wrote a song about being fireproof but niall is not fireproof http://t.co/e1gyNRkuz6
 http://t.co/e1gyNRkuz6
 http://twitter.com/highonlirry/status/549413275000381441/photo/1
 he decided to become a professional photographer for one direction

 #reasonsniallleftonedirection http://t.co/4VOEcrR5Gg
 #reasonsniallleftonedirection

 He couldn't take the tension of sitting between Louis and Harry anymore.. http://t.co/yOotH0E40n
 #reasonsniallleftonedirection the interviewer didnt let him take the group selfie http://t.co/K1bbkCHIuU
 #reasonsniallleftonedirection

 Because he wanted to pursue his carrer as volunteer fan for 5sos http://t.co/cY0tP24rAQ

 Process finished with exit code 0


 **/
