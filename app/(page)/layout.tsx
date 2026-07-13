
import LightPillar from '@/components/LightPillar'

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            {/* Background */}
            <div className="fixed inset-0 bg-black -z-10">

                {/* <LightPillar
                    topColor="#FFFF8A"
                    bottomColor="#F97316"
                    intensity={1}
                    rotationSpeed={3}
                    glowAmount={0.009}
                    pillarWidth={6.5}
                    pillarHeight={0.2}
                    noiseIntensity={1.5}
                    pillarRotation={43}
                    interactive={false}
                    mixBlendMode="lighten"
                    quality="medium"
                /> */}


            </div>

            {/* App content */}
            <div className="relative z-10">
                {children}
            </div>

        </>
    )
}