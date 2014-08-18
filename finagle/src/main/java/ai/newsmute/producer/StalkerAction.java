package ai.newsmute.producer;

public enum StalkerAction {
    CREATE,
    READ,
    DELETE,

    /**
     * Error is used to specify all invalid states. This helps in switch statements
     * <code><pre>
     * switch (to != null ? to: StalkerActions.ERROR) {
     *   case CREATE:
     *          break;
     *   case DELETE:
     *          break;
     *   default:;
     * }
     * </pre>
     * </code>
     */
    ERROR;

    public static StalkerAction to(final String enumAsString) {
        try {
            return StalkerAction.valueOf(enumAsString);
        } catch (final Throwable e) {
            return StalkerAction.ERROR;

        }
    }
}
