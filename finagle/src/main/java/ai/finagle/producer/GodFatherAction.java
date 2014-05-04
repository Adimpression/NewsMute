package ai.finagle.producer;

public enum GodFatherAction {
    /**
     * Initial create, before verifying
     */
    CREATE,
    /**
     * On email or so click
     */
    VERIFIED,

    /**
     * Error is used to specify all invalid states. This helps in switch statements
     * <code><pre>
     * switch (to != null ? to: YawnerAction.ERROR) {
     *   case READ:
     *          break;
     *   case DELETE:
     *          break;
     *   default:;
     * }
     * </pre>
     * </code>
     */
    ERROR;

    public static GodFatherAction to(final String enumAsString) {
        try {
            return GodFatherAction.valueOf(enumAsString);
        } catch (final Throwable e) {
            return GodFatherAction.ERROR;
        }
    }

}
