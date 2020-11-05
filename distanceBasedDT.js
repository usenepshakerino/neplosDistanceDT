var localPlayer = Entity.GetLocalPlayer();
var ResultX, ResultY, ResultXX, ResultYY, ResultXY, ResultC;
var screenSize, font;
var hitboxPos, Enemies, localPos;
var DT, exploitCharge, ticks, fired, clockCorrection, maxUsrCmdProcessTicks, tolerance, canshift; 
var distance, distanceToEnemy;

ResultC = 0;
fired = false;

UI.AddSubTab(["Config", "SUBTAB_MGR"], "Distance based DT");
UI.AddCheckbox(["Config", "Distance based DT", "Distance based DT"], "Faster DT");
UI.AddCheckbox(["Config", "Distance based DT", "Distance based DT"], "Show DT speed");
UI.AddCheckbox(["Config", "Distance based DT", "Distance based DT"], "Show distance");

hooks();

function distanceBasedDT()
{
    Enemies = Entity.GetEnemies();

    for(i = 0; i < Enemies.length; i++)
    {
        if (Entity.IsValid(Enemies[i]) == true && Entity.IsAlive(Enemies[i]) && Entity.IsDormant(Enemies[i]) == false ){
            hitboxPos = Entity.GetHitboxPosition(localPlayer, 0);
            localPos = Entity.GetEyePosition(Enemies[i]);

            ResultX = Math.abs(hitboxPos[0] - localPos[0]);
            ResultY = Math.abs(hitboxPos[1] - localPos[1]);
            ResultXX = ResultX * ResultX;
            ResultYY = ResultY * ResultY;
            ResultXY = ResultXX + ResultYY;
            ResultC = Math.sqrt(ResultXY);

            distance = ResultC;

            clockCorrection = 0;
            maxUsrCmdProcessTicks = 18;
            canshift = 18;

            if(UI.GetValue(["Config", "Distance based DT", "Distance based DT"], "Show distance")) {
                Cheat.PrintColor([178, 235, 51], distance)
            }

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
    if(UI.GetValue(["Config", "Distance based DT", "Distance based DT"], "Faster DT"))
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
    Exploit.EnableRecharge(), Exploit.OverrideShift(16), Exploit.OverrideTolerance(0)
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
