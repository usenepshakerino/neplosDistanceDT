var localPlayer = Entity.GetLocalPlayer();
var ResultX, ResultY, ResultXX, ResultYY, ResultXY, ResultC;
var screenSize, font;
var hitboxPos, Enemies, localPos;
var DT, exploitCharge, ticks, fired, clockCorrection, maxUsrCmdProcessTicks, tolerance, canshift; 
var distance, distanceToEnemy;

ResultC = 0;
DT = 0;
fired = false;

UI.AddSubTab(["Config", "SUBTAG_MGR"], "Positional Settings");
UI.AddCheckbox(["Config", "Positional Settings", "Distance Based DT"], "Faster DT");
UI.AddCheckbox(["Config", "Positional Settings", "Distance Based DT"], "Show DT speed");
UI.AddCheckbox(["Config", "Positional Settings", "Distance Based DT"], "Show distance");

hooks();

function distanceBasedDT()
{
    Enemies = Entity.GetEnemies();

    for(i = 0; i < Enemies.length; i++)
    {
        if (Entity.IsValid(Enemies[i]) == true && Entity.IsAlive(Enemies[i]) && Entity.IsDormant(Enemies[i]) == false ){
            hitboxPos = Entity.GetHitboxPosition(localPlayer, 0);
            localPos = Entity.GetEyePosition(Enemies[i]);

            ResultX = Math.abs(hitboxPos[0] - localPos[0])
            ResultY = Math.abs(hitboxPos[1] - localPos[1])
            ResultXX = ResultX * ResultX;
            ResultYY = ResultY * ResultY;
            ResultXY = ResultXX + ResultYY;
            ResultC = Math.sqrt(ResultXY);

            distance = ResultC;

            clockCorrection = 0;
            maxUsrCmdProcessTicks = 18;
            canshift = 18;

            switch(distance)
            {
                case (distance < 400): {
                    DT = 16;
                    tolerance = 0;
                } break;
                case (distance < 700 && distance > 400): {
                    DT = 14;
                    tolerance = 1;
                } break;
                case(distance < 1100 && distance > 700):
                {
                    DT = 12;
                    tolerance = 1;
                } break;
                case (distance > 1100): {
                    DT = 10;
                    tolerance = 2;
                } break;
            }
            fired = true;
        }
    }
}

function fasterDoubleTap()
{
    if(UI.GetValue(["Config", "Positional Settings", "Distance Based DT"], "Faster DT"))
    {
        exploitCharge = Exploit.GetCharge();

        Exploit[(1 != exploitCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", clockCorrection), Convar.SetInt("sv_maxusrcmdprocessticks", maxUsrCmdProcessTicks), Exploit.OverrideShift(DT),
            Exploit.OverrideTolerance(tolerance), canShiftShot(canshift) && 1 != exploitCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    }
    else 
    {
        Exploit.EnableRecharge(), Exploit.OverrideShift(12), Exploit.OverrideTolerance(3)
    }
}

function fasterDoubleTapUnload() {
    Exploit.EnableRecharge(), Exploit.OverrideShift(DT), Exploit.OverrideTolerance(tolerance)
}

function createMove()
{
    if (!Entity.IsValid(localPlayer)) return;
    if (!Entity.IsAlive(localPlayer)) return;

    fasterDoubleTap();
}

function hooks()
{
    Cheat.RegisterCallback("Unload", "fasterDoubleTapUnload");
    Cheat.RegisterCallback("CreateMove", "createMove");
    Cheat.RegisterCallback("Draw", "distanceBasedDT");
}