package ai.finagle.producer;

/**
 * Note that {@link RE} and {@link REQUIRED_ENUM} are both the same but we unfortunately have to
 * specify it in two places
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 24/11/13
 * Time: 3:27 PM
 */
public final class FORMATTER<RE> {

    private FORMATTER(){
    }

    public static <RE> FORMATTER<RE> DEFAULT(){
        return new FORMATTER<RE>();
    }

    /**
     *
     * @param REQUIRED_ENUM The enum's class to which the @param enumAsString will be converted
     * @param enumAsString The required enum types option, e.g CAR.TOYOTA where CAR is the enum
     * @return The required enum constant, of type @param REQUIRED_ENUM with constant corresponding to @param enumAsString
     */
    public RE to(final Class REQUIRED_ENUM, final String enumAsString) {

        RE returnVal;
        try {
            returnVal = (RE) Enum.valueOf(REQUIRED_ENUM, enumAsString);
        } catch (final IllegalArgumentException e) {
            returnVal = null;
        }
        return returnVal;
    }
}