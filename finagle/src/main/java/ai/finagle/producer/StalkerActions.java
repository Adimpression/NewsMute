package ai.finagle.producer;

public enum StalkerActions implements ParameterActions{
    CREATE,
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

    public static FORMATTER<StalkerActions> FORMATER = FORMATTER.DEFAULT();

    @Override
    public Integer actionId() {
        switch (this) {
            case CREATE:
                return 1;
            case DELETE:
                return 2;
            default: throw new UnsupportedOperationException("Invalid Command");
        }
    }
}
