export const Int = "Int"
export const RadioParameter = "Radio"

export const ConfigurationParameters = [
    {
        macroType: "m4_define_hier",
        readableName: "CPU cores",
        verilogName: "M4_CORE",
        defaultValue: 2,
        jsonKey: "cores",
        type: Int,
        min: 0,
        validator: (input) => input >= 0,
        configurationCategory: "CPU",
        description: "Number of cores"
    },
    {
        macroType: "m4_define_hier",
        readableName: "VCs",
        verilogName: "M4_VC",
        defaultValue: 2,
        jsonKey: "vcs",
        type: Int,
        min: 0,
        validator: (input) => input >= 0,
        configurationCategory: "CPU",
        description: "VCs (meaningful if > 1 core)"
    },
    {
        macroType: "m4_define_hier",
        readableName: "Priority levels",
        verilogName: "M4_PRIO",
        defaultValue: 2,
        jsonKey: "prios",
        type: Int,
        min: 0,
        validator: (input) => input >= 0,
        configurationCategory: "CPU",
        description: "Number of priority levels in the NoC"
    },
    {
        macroType: "m4_define",
        readableName: "Max Packet Size",
        verilogName: "M4_MAX_PACKET_SIZE",
        defaultValue: 3,
        jsonKey: "max_packet_size",
        type: Int,
        min: 0,
        validator: (input) => input >= 0,
        configurationCategory: "CPU",
        description: "Max number of payload flits in a packet"
    },
    {
        macroType: "m4_define",
        readableName: "Implementation vs Simulation - true for implementation",
        verilogName: "M4_IMPL",
        defaultValue: true,
        jsonKey: "impl",
        type: Boolean,
        configurationCategory: "CPU",
        description: "For implementation (vs. simulation)"
    },
    {
        macroType: "m4_define",
        readableName: "Soft reset",
        verilogName: "m4_soft_reset",
        defaultValue: true,
        jsonKey: "soft_reset",
        type: Boolean,
        configurationCategory: "CPU",
        description: "A hook for a software-controlled reset. None by default"
    },
    {
        macroType: "m4_define",
        readableName: "Alignment of load return pseudo-instruction into |mem pipeline",
        verilogName: "M4_LD_RETURN_ALIGN",
        defaultValue: true,
        jsonKey: "ld_return_align",
        type: Boolean,
        configurationCategory: "CPU",
        description: "If |mem stages reflect nominal alignment w/ load instruction, this is the nominal load latency."
    },
    {
        macroType: "m4_define",
        readableName: "CPU Blocked?",
        verilogName: "m4_cpu_blocked",
        defaultValue: false,
        jsonKey: "cpu_blocked",
        type: Boolean,
        configurationCategory: "CPU",
        description: "A hook for CPU back-pressure in M4_REG_RD_STAGE. Various sources of back-pressure can add to this expression."
    },
    {
        macroType: "m4_define",
        readableName: "Branch prediction?",
        verilogName: "M4_BRANCH_PRED",
        defaultValue: "fallthrough",
        jsonKey: "branch_pred",
        type: RadioParameter,
        possibleValues: ["fallthrough", "two_bit"],
        validator: (input, setting) => setting.possibleValues.includes(input),
        configurationCategory: "CPU",
        description: "A hook for CPU back-pressure in M4_REG_RD_STAGE. Various sources of back-pressure can add to this expression. two_bit or fallthrough"
    }
]